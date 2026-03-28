import os
import json
from fireworks.client import Fireworks
from dotenv import load_dotenv

load_dotenv()

fw_client = Fireworks(api_key=os.environ.get("FIREWORKS_API_KEY"))

def generate_repricing_recommendation(
    product_name: str,
    your_price: float,
    platform_prices: dict
) -> dict:
    valid_prices = {
        k: v["price"] for k, v in platform_prices.items()
        if v and v.get("price")
    }

    if not valid_prices:
        return {
            "recommendation_type": "hold",
            "suggested_price": your_price,
            "reasoning": "No competitor data available.",
            "confidence_score": 0.0,
            "best_competitor_price": None,
            "best_competitor_platform": None
        }

    best_platform = min(valid_prices, key=valid_prices.get)
    best_price = valid_prices[best_platform]

    prompt = f"""
You are a pricing strategist for an Indian e-commerce clothing store.

Product: {product_name}
Our current price: ₹{your_price}
Competitor prices:
{json.dumps(valid_prices, indent=2)}

Analyze and respond with ONLY a JSON object:
{{
  "recommendation_type": "lower_price" | "match_price" | "hold" | "raise_price",
  "suggested_price": <float>,
  "reasoning": "<2 sentence explanation>",
  "confidence_score": <float between 0 and 1>
}}
"""

    response = fw_client.chat.completions.create(
        model="accounts/fireworks/models/llama-v3p3-70b-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=300,
    )

    raw = response.choices[0].message.content.strip()
    start = raw.find("{")
    end = raw.rfind("}") + 1
    result = json.loads(raw[start:end])
    result["best_competitor_price"] = best_price
    result["best_competitor_platform"] = best_platform
    result["current_your_price"] = your_price
    return result