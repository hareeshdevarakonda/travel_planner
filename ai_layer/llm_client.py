import json
from groq import AsyncGroq
from ai_layer.config import GROQ_API_KEY, GROQ_MODEL

_client = None

def _get_client():
    global _client
    if _client is None:
        if not GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is not set")
        _client = AsyncGroq(api_key=GROQ_API_KEY)
    return _client

async def groq_chat(messages, model: str = None, temperature: float = 0.4) -> str:
    client = _get_client()
    resp = await client.chat.completions.create(
        model=model or GROQ_MODEL,
        temperature=temperature,
        messages=messages,
    )
    return (resp.choices[0].message.content or "").strip()

async def groq_json(messages, model: str = None, temperature: float = 0.3) -> dict:
    txt = await groq_chat(messages, model=model, temperature=temperature)
    return json.loads(txt)