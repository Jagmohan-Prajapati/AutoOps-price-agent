def build_price_extraction_goal(product_name: str, platform: str) -> str:
    goals = {
        "amazon": f"""
Search for '{product_name}' on this Amazon.in page.
Find the first relevant product listing in the search results.
Navigate to that product's page.
Extract the following information:
- Current selling price (in INR ₹)
- Original/MRP price if shown (crossed out price)
- Discount percentage if shown
- Stock status (In Stock / Out of Stock / Limited Stock)
- Product rating (out of 5)
- Number of ratings/reviews
- Full product URL

Return ONLY a JSON object in this exact format:
{{
  "price": 899.00,
  "original_price": 1199.00,
  "discount_percent": 25.0,
  "stock_status": "in_stock",
  "rating": 4.2,
  "rating_count": 1523,
  "product_url": "https://amazon.in/..."
}}
If a field is not found, use null.
""",

        "flipkart": f"""
Search for '{product_name}' on this Flipkart page.
Click on the first relevant product in the search results.
Extract the following information:
- Current selling price (in INR ₹)
- Original/MRP price if shown
- Discount percentage if shown
- Stock status (In Stock / Out of Stock)
- Product rating (out of 5)
- Number of ratings
- Full product URL

Return ONLY a JSON object in this exact format:
{{
  "price": 849.00,
  "original_price": 1099.00,
  "discount_percent": 22.0,
  "stock_status": "in_stock",
  "rating": 4.1,
  "rating_count": 892,
  "product_url": "https://flipkart.com/..."
}}
If a field is not found, use null.
""",

        "myntra": f"""
Search for '{product_name}' on this Myntra page.
Click on the first relevant product in the search results.
Extract the following information:
- Current selling price (in INR ₹)
- Original/MRP price if shown
- Discount percentage if shown
- Stock status (In Stock / Out of Stock)
- Product rating (out of 5)
- Number of ratings
- Full product URL

Return ONLY a JSON object in this exact format:
{{
  "price": 799.00,
  "original_price": 999.00,
  "discount_percent": 20.0,
  "stock_status": "in_stock",
  "rating": 4.3,
  "rating_count": 634,
  "product_url": "https://myntra.com/..."
}}
If a field is not found, use null.
"""
    }
    return goals.get(platform, "")