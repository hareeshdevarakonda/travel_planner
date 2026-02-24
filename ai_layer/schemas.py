# ai_layer/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    context: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
