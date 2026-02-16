# ai_layer/llm_client.py
from typing import List, Dict, Any, Optional
from ai_layer.config import settings

def _ensure_key():
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not set (check your .env)")

async def chat_completion(
    messages: List[Dict[str, Any]],
    model: Optional[str] = None,
    temperature: float = 0.7,
) -> str:
    _ensure_key()

    # Imported here so backend doesn't crash if AI deps aren't installed yet
    from groq import AsyncGroq

    client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    resp = await client.chat.completions.create(
        model=model or settings.GROQ_MODEL,
        messages=messages,
        temperature=temperature,
    )

    return resp.choices[0].message.content or ""
