import os
import json
import asyncio
from tinyfish import TinyFish
from dotenv import load_dotenv

load_dotenv()

client = TinyFish(api_key=os.environ.get("TINYFISH_API_KEY"))

PLATFORM_URLS = {
    "amazon":  "https://www.amazon.in/s?k={query}",
    "flipkart": "https://www.flipkart.com/search?q={query}",
    "myntra":  "https://www.myntra.com/{query}",
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
            "message": f"\U0001f5a5 Agent navigating {platform.capitalize()} for '{product_name}'..."
        })

        result_text = None

        # ------------------------------------------------------------------ #
        # FIX: TinyFish client.agent.stream() is a SYNCHRONOUS context mgr.  #
        # Running it directly in async def blocks the entire event loop,      #
        # which prevents SSE queue events from being consumed.                #
        # Solution: offload the blocking call to a thread pool via            #
        # asyncio.to_thread() so the event loop stays free to serve SSE.     #
        # ------------------------------------------------------------------ #
        def _run_tinyfish_sync():
            """Blocking TinyFish call - runs in a thread pool executor."""
            collected_events = []
            with client.agent.stream(
                url=url,
                goal=goal,
                browser_profile="stealth",  # Anti-bot mode for Amazon/Flipkart
            ) as stream:
                for event in stream:
                    collected_events.append(event)
            return collected_events

        # Run blocking TinyFish in thread pool - yields control back to asyncio
        all_events = await asyncio.to_thread(_run_tinyfish_sync)

        # Now stream the collected events back through the SSE callback
        for event in all_events:
            await event_callback({
                "type": "agent_step",
                "platform": platform,
                "message": f"\u2699 [{platform.capitalize()}] {str(event)[:120]}"
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
                # NULL GUARD
                if start == -1 or end == 0:
                    await event_callback({
                        "type": "agent_error",
                        "platform": platform,
                        "message": f"\u26a0 [{platform.capitalize()}] Could not parse result - no JSON found."
                    })
                    return None
                data = json.loads(raw[start:end])

            await event_callback({
                "type": "agent_done",
                "platform": platform,
                "message": f"\u2705 [{platform.capitalize()}] Done. Price: \u20b9{data.get('price', 'N/A')}"
            })
            return data

        return None

    except Exception as e:
        await event_callback({
            "type": "agent_error",
            "platform": platform,
            "message": f"\u274c [{platform.capitalize()}] Agent error: {str(e)[:200]}"
        })
        return None
