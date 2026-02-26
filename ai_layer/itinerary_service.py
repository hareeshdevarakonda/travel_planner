import json
from ai_layer.config import ITIN_GROQ_API_KEY, ITIN_GROQ_MODEL, ITIN_TEMPERATURE, ITIN_MAX_ITEMS_PER_DAY
from groq import AsyncGroq

SYSTEM = """Return STRICT JSON only. No markdown.

Schema:
{
  "days":[
    {"day":1,"title":"string","items":[
      {"order":1,"place_name":"string","headline":"string","description":"5-10 sentences"}
    ]}
  ]
}

Rules:
- Use real famous places
- Include local food experience
- Max items/day = MAX
"""

async def generate_itinerary(destination: str, start_date: str, end_date: str) -> dict:
    if not ITIN_GROQ_API_KEY:
        raise RuntimeError("ITIN_GROQ_API_KEY is not set")

    client = AsyncGroq(api_key=ITIN_GROQ_API_KEY)
    resp = await client.chat.completions.create(
        model=ITIN_GROQ_MODEL,
        temperature=ITIN_TEMPERATURE,
        messages=[
            {"role":"system","content": SYSTEM.replace("MAX", str(ITIN_MAX_ITEMS_PER_DAY))},
            {"role":"user","content": json.dumps({
                "destination": destination,
                "start_date": start_date,
                "end_date": end_date
            })}
        ]
    )
    txt = (resp.choices[0].message.content or "").strip()
    return json.loads(txt)