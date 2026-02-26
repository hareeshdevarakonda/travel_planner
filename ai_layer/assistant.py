# ai_layer/assistant.py
from typing import Dict, Any, Optional, List
from ai_layer.llm_client import groq_chat

SYSTEM_PROMPT = """You are a travel planning assistant for a travel planner website.
Be practical and specific. Ask at most 1-2 clarifying questions only if needed.
Use any provided context.
Return concise answers with bullets where useful.
"""

# map MMS codes -> human readable language name for LLM instruction
LANG_MAP = {
    "eng": "English",
    "hin": "Hindi",
    "tel": "Telugu",
    "tam": "Tamil",
    "kan": "Kannada",
    "mal": "Malayalam",
    "mar": "Marathi",
    "ben": "Bengali",
    "guj": "Gujarati",
    "pan": "Punjabi",
    "urd": "Urdu",
}

def _build_messages(user_message: str, context: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    ctx = context or {}
    lang_code = (ctx.get("reply_language") or ctx.get("stt_language") or "eng").strip()
    lang_name = LANG_MAP.get(lang_code, "English")

    # Strong instruction: respond only in selected language
    lang_instruction = f"IMPORTANT: Respond ONLY in {lang_name}. Do not use any other language."

    ctx_str = ""
    if ctx:
        ctx_str = f"\n\nContext: {ctx}"

    return [
        {"role": "system", "content": SYSTEM_PROMPT + "\n" + lang_instruction},
        {"role": "user", "content": user_message + ctx_str},
    ]

async def generate_reply(message: str, context: Optional[Dict[str, Any]] = None) -> str:
    messages = _build_messages(message, context)
    return await groq_chat(messages)
