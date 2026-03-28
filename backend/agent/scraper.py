import asyncio
from .tinyfish_client import run_agent_for_platform
from .goals import build_price_extraction_goal

PLATFORMS = ["amazon", "flipkart", "myntra"]

async def scan_product(product: dict, event_callback) -> dict:
    tasks = []
    for platform in PLATFORMS:
        goal = build_price_extraction_goal(product["name"], platform)
        tasks.append(
            run_agent_for_platform(
                product_name=product["name"],
                platform=platform,
                goal=goal,
                event_callback=event_callback
            )
        )

    results = await asyncio.gather(*tasks, return_exceptions=True)

    return {
        "product_id": product["id"],
        "product_name": product["name"],
        "your_price": product["your_price"],
        "amazon":   results[0] if not isinstance(results[0], Exception) else None,
        "flipkart": results[1] if not isinstance(results[1], Exception) else None,
        "myntra":   results[2] if not isinstance(results[2], Exception) else None,
    }