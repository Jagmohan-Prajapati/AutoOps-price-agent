import asyncio
import json
import os
from datetime import datetime
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from db.supabase_client import supabase
from agent.scraper import scan_product
from analysis.pricing_engine import generate_repricing_recommendation
from analysis.alert_engine import generate_alerts

load_dotenv()

app = FastAPI(title="AutoOps Price Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory SSE event queues per scan_id ─────────────────────────────────
scan_event_queues: dict[str, asyncio.Queue] = {}


# ── Pydantic Models ────────────────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    category: str | None = None
    your_price: float
    target_margin: float = 20.0
    amazon_search_query: str | None = None
    flipkart_search_query: str | None = None
    myntra_search_query: str | None = None

class ScanRequest(BaseModel):
    product_ids: list[str]
    platforms: list[str] = ["amazon", "flipkart", "myntra"]


# ── Products ───────────────────────────────────────────────────────────────
@app.get("/api/products")
async def get_products():
    res = supabase.table("products").select("*").eq("is_active", True).execute()
    return res.data

@app.post("/api/products")
async def create_product(product: ProductCreate):
    data = product.model_dump()
    data["amazon_search_query"] = data.get("amazon_search_query") or product.name
    data["flipkart_search_query"] = data.get("flipkart_search_query") or product.name
    data["myntra_search_query"] = data.get("myntra_search_query") or product.name
    res = supabase.table("products").insert(data).execute()
    return res.data[0]

@app.get("/api/products/{product_id}/history")
async def get_price_history(product_id: str):
    res = (
        supabase.table("price_history")
        .select("*")
        .eq("product_id", product_id)
        .order("scanned_at", desc=False)
        .execute()
    )
    return res.data


# ── Alerts ─────────────────────────────────────────────────────────────────
@app.get("/api/alerts")
async def get_alerts():
    res = (
        supabase.table("alerts")
        .select("*, products(name)")
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    return res.data

@app.patch("/api/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    res = supabase.table("alerts").update({"is_read": True}).eq("id", alert_id).execute()
    return res.data[0]


# ── Scan History ───────────────────────────────────────────────────────────
@app.get("/api/scans")
async def get_scan_history():
    res = (
        supabase.table("scan_runs")
        .select("*")
        .order("started_at", desc=True)
        .limit(30)
        .execute()
    )
    return res.data

@app.get("/api/scans/{scan_id}")
async def get_scan_detail(scan_id: str):
    scan = supabase.table("scan_runs").select("*").eq("id", scan_id).execute()
    products = (
        supabase.table("scan_run_products")
        .select("*, products(name, your_price)")
        .eq("scan_id", scan_id)
        .execute()
    )
    price_data = (
        supabase.table("price_history")
        .select("*")
        .eq("scan_id", scan_id)
        .execute()
    )
    return {
        "scan": scan.data[0] if scan.data else None,
        "products": products.data,
        "price_data": price_data.data
    }


# ── Trigger Scan ───────────────────────────────────────────────────────────
@app.post("/api/scan")
async def trigger_scan(req: ScanRequest):
    # Create scan_run record
    scan_res = supabase.table("scan_runs").insert({
        "status": "running",
        "platforms": req.platforms,
        "total_products": len(req.product_ids),
        "scanned_products": 0,
        "alerts_generated": 0,
        "started_at": datetime.utcnow().isoformat()
    }).execute()
    scan_id = scan_res.data[0]["id"]

    # Create junction records
    for pid in req.product_ids:
        supabase.table("scan_run_products").insert({
            "scan_id": scan_id,
            "product_id": pid,
            "status": "pending"
        }).execute()

    # Create SSE queue for this scan
    scan_event_queues[scan_id] = asyncio.Queue()

    # Run scan in background
    asyncio.create_task(run_scan_background(scan_id, req.product_ids))

    return {"scan_id": scan_id, "status": "running"}


# ── SSE Stream ─────────────────────────────────────────────────────────────
@app.get("/api/stream")
async def stream_scan_events(scan_id: str):
    async def event_generator() -> AsyncGenerator[str, None]:
        queue = scan_event_queues.get(scan_id)
        if not queue:
            yield f"data: {json.dumps({'type': 'error', 'message': 'Scan not found'})}\n\n"
            return

        while True:
            try:
                event = await asyncio.wait_for(queue.get(), timeout=60.0)
                yield f"data: {json.dumps(event)}\n\n"
                if event.get("type") == "scan_complete":
                    break
            except asyncio.TimeoutError:
                yield f"data: {json.dumps({'type': 'heartbeat'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


# ── Background Scan Worker ─────────────────────────────────────────────────
async def run_scan_background(scan_id: str, product_ids: list[str]):
    queue = scan_event_queues[scan_id]
    total_alerts = 0

    async def emit(event: dict):
        await queue.put(event)

    try:
        products_res = supabase.table("products").select("*").in_("id", product_ids).execute()
        products = products_res.data

        await emit({"type": "scan_start", "message": f"🚀 Starting scan for {len(products)} products across 3 platforms..."})

        for product in products:
            await emit({"type": "product_start", "message": f"📦 Scanning: {product['name']}"})

            supabase.table("scan_run_products").update({"status": "scanning"}) \
                .eq("scan_id", scan_id).eq("product_id", product["id"]).execute()

            # Run TinyFish agents concurrently for all 3 platforms
            scan_results = await scan_product(product, emit)

            # Save price history
            for platform in ["amazon", "flipkart", "myntra"]:
                data = scan_results.get(platform)
                if data and data.get("price"):
                    supabase.table("price_history").insert({
                        "product_id": product["id"],
                        "scan_id": scan_id,
                        "platform": platform,
                        "price": data.get("price"),
                        "original_price": data.get("original_price"),
                        "discount_percent": data.get("discount_percent"),
                        "stock_status": data.get("stock_status"),
                        "rating": data.get("rating"),
                        "rating_count": data.get("rating_count"),
                        "product_url": data.get("product_url"),
                    }).execute()

            # Generate and save alerts
            alerts = generate_alerts(product, scan_results, scan_id)
            if alerts:
                supabase.table("alerts").insert(alerts).execute()
                total_alerts += len(alerts)
                for alert in alerts:
                    await emit({"type": "alert", "message": f"🔔 {alert['message']}"})

            # Generate AI repricing recommendation
            platform_prices = {
                p: scan_results[p] for p in ["amazon", "flipkart", "myntra"]
                if scan_results.get(p)
            }
            recommendation = generate_repricing_recommendation(
                product["name"], product["your_price"], platform_prices
            )
            supabase.table("ai_recommendations").insert({
                "product_id": product["id"],
                "scan_id": scan_id,
                **recommendation
            }).execute()

            await emit({"type": "recommendation", "message": f"🧠 AI Recommendation for {product['name']}: {recommendation['recommendation_type'].replace('_', ' ').title()} → ₹{recommendation['suggested_price']}"})

            # Mark product as done
            supabase.table("scan_run_products").update({"status": "done"}) \
                .eq("scan_id", scan_id).eq("product_id", product["id"]).execute()

            # Update scan progress
            supabase.table("scan_runs").update({
                "scanned_products": products.index(product) + 1,
                "alerts_generated": total_alerts
            }).eq("id", scan_id).execute()

        # Mark scan complete
        supabase.table("scan_runs").update({
            "status": "completed",
            "completed_at": datetime.utcnow().isoformat(),
            "alerts_generated": total_alerts
        }).eq("id", scan_id).execute()

        await emit({"type": "scan_complete", "message": f"✅ Scan complete! {total_alerts} alerts generated."})

    except Exception as e:
        supabase.table("scan_runs").update({
            "status": "failed",
            "error_message": str(e),
            "completed_at": datetime.utcnow().isoformat()
        }).eq("id", scan_id).execute()

        await emit({"type": "scan_error", "message": f"💥 Scan failed: {str(e)}"})

    finally:
        # Clean up queue after 5 mins
        await asyncio.sleep(300)
        scan_event_queues.pop(scan_id, None)


# ── Health Check ───────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "AutoOps API"}