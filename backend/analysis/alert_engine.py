from datetime import datetime

ALERT_THRESHOLD_PERCENT = 10.0  # alert if competitor is 10%+ cheaper

def generate_alerts(product: dict, scan_results: dict, scan_id: str) -> list:
    alerts = []
    your_price = float(product["your_price"])

    for platform in ["amazon", "flipkart", "myntra"]:
        data = scan_results.get(platform)
        if not data or not data.get("price"):
            continue

        competitor_price = float(data["price"])
        gap_percent = ((your_price - competitor_price) / your_price) * 100

        # Competitor is undercutting you by threshold%
        if gap_percent >= ALERT_THRESHOLD_PERCENT:
            alerts.append({
                "product_id": product["id"],
                "scan_id": scan_id,
                "platform": platform,
                "alert_type": "undercut",
                "old_price": your_price,
                "new_price": competitor_price,
                "price_gap_percent": round(gap_percent, 2),
                "message": f"{platform.capitalize()} is selling '{product['name']}' "
                           f"at ₹{competitor_price} — {round(gap_percent, 1)}% cheaper than your ₹{your_price}.",
                "is_read": False
            })

        # Out of stock on competitor
        if data.get("stock_status") == "out_of_stock":
            alerts.append({
                "product_id": product["id"],
                "scan_id": scan_id,
                "platform": platform,
                "alert_type": "out_of_stock",
                "old_price": None,
                "new_price": competitor_price,
                "price_gap_percent": None,
                "message": f"'{product['name']}' is OUT OF STOCK on {platform.capitalize()} — opportunity to capture demand.",
                "is_read": False
            })

    return alerts