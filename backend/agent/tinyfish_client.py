import os
import json
from tinyfish import TinyFish
from dotenv import load_dotenv

load_dotenv()

client = TinyFish(api_key=os.environ.get("TINYFISH_API_KEY"))

PLATFORM_URLS = {
    "amazon":   "https://www.amazon.in/s?k={query}",
    "flipkart": "https://www.flipkart.com/search?q={query}",
    "myntra":   "https://www.myntra.com/{query}",
}

async def run_agent_for_platform(
    product_name: str,
    platform: str,
    goal: str,
    event_callback  # async callable to stream events back
) -> dict | None:
    url = PLATFORM_URLS[platform].format(
        query=product_name.replace(" ", "+")
    )

    try:
        await event_callback({
            "type": "agent_start",
            "platform": platform,
            "message": f"🤖 Agent navigating {platform.capitalize()} for '{product_name}'..."
        })

        result_text = None

        with client.agent.stream(
            url=url,
            goal=goal,
            browser_profile="stealth",
        ) as stream:
            for event in stream:
                await event_callback({
                    "type": "agent_step",
                    "platform": platform,
                    "message": f"⚙️  [{platform.capitalize()}] {str(event)[:120]}"
                })
                result_text = event

        # Parse the final JSON result from the agent
        if result_text:
            if isinstance(result_text, dict):
                data = result_text
            else:
                raw = str(result_text)
                start = raw.find("{")
                end = raw.rfind("}") + 1
                # ADD THIS NULL GUARD
                if start == -1 or end == 0:
                    await event_callback({
                        "type": "agent_error",
                        "platform": platform,
                        "message": f"[{platform.capitalize()}] Could not parse price data — agent returned no JSON"
                    })
                    return None
                data = json.loads(raw[start:end])

    except Exception as e:
        await event_callback({
            "type": "agent_error",
            "platform": platform,
            "message": f"❌ [{platform.capitalize()}] Error: {str(e)}"
        })
        return None