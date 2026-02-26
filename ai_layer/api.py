from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ai_layer.schemas import ChatRequest, ChatResponse
from ai_layer.assistant import generate_reply
from ai_layer.transcribe import transcribe_audio_file
from app.auth import verify_token

router = APIRouter(prefix="/ai", tags=["AI"])
security = HTTPBearer()

def verify_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token from request header"""
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, auth: dict = Depends(verify_auth)):
    try:
        reply = await generate_reply(req.message, req.context)
        return ChatResponse(reply=reply, session_id=req.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str | None = Form(default="eng"),
    auth: dict = Depends(verify_auth),
):
    try:
        text = await transcribe_audio_file(audio, language=language or "eng")
        return {"text": text, "language": language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))