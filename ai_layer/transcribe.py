import os
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from ai_layer.schemas import ChatRequest, ChatResponse
from ai_layer.assistant import generate_reply
from ai_layer.stt_mms import transcribe_audio_file

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        reply = await generate_reply(req.message, req.context)
        return ChatResponse(reply=reply, session_id=req.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str | None = Form(default=None),
):
    """
    Upload audio (webm/wav/mp3/...) -> transcript (multilingual via Meta MMS).
    """
    try:
        suffix = os.path.splitext(audio.filename or "")[1] or ".bin"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp_path = tmp.name
            content = await audio.read()
            tmp.write(content)

        text = transcribe_audio_file(tmp_path, language=language)

        # cleanup
        try:
            os.remove(tmp_path)
        except:
            pass

        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
