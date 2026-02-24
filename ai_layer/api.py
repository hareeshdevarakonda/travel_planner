# ai_layer/api.py
import os
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from ai_layer.schemas import ChatRequest, ChatResponse
from ai_layer.assistant import generate_reply
from ai_layer.stt_mms import transcribe_audio_file

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Text chat endpoint (Groq LLM behind generate_reply()).
    """
    try:
        reply = await generate_reply(req.message, req.context)
        return ChatResponse(reply=reply, session_id=req.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = Form(default="eng"),
):
    """
    Audio -> Text transcription using Meta MMS.
    Accepts multipart/form-data:
      - audio: file (webm/wav/mp3/...)
      - language: MMS language code (default 'eng')
    """
    tmp_path = None
    try:
        # Keep the original extension if possible (helps debugging)
        ext = os.path.splitext(audio.filename or "")[1] or ".bin"

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp_path = tmp.name
            content = await audio.read()
            tmp.write(content)

        text = transcribe_audio_file(tmp_path, language=language)
        return {"text": text, "language": language}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass
