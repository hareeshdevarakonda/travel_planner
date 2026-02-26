# ai_layer/stt_mms.py
import os
import tempfile
import subprocess
from typing import Optional

import numpy as np
import torch
import soundfile as sf
from transformers import AutoProcessor, Wav2Vec2ForCTC

from ai_layer.config import MMS_MODEL

# Lazy-loaded globals
_processor = None
_model = None
_device = None
_loaded_lang = None  # cache adapter


def _load_mms_base():
    global _processor, _model, _device
    if _processor is not None and _model is not None:
        return

    _device = "cuda" if torch.cuda.is_available() else "cpu"
    _processor = AutoProcessor.from_pretrained(MMS_MODEL)
    _model = Wav2Vec2ForCTC.from_pretrained(MMS_MODEL).to(_device)
    _model.eval()


def _set_language(lang: str):
    """
    For facebook/mms-1b-all, best practice is:
      tokenizer.set_target_lang(lang)
      model.load_adapter(lang)
    """
    global _loaded_lang
    if not lang:
        return
    if _loaded_lang == lang:
        return

    # set target lang + load adapter
    _processor.tokenizer.set_target_lang(lang)
    _model.load_adapter(lang)
    _loaded_lang = lang


def _ffmpeg_to_wav16k_mono(src_path: str, dst_path: str):
    ffmpeg = os.getenv("FFMPEG_PATH", "ffmpeg")  # explicit path recommended on Windows
    cmd = [
        ffmpeg, "-y",
        "-i", src_path,
        "-ac", "1",
        "-ar", "16000",
        "-vn",
        dst_path
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except FileNotFoundError:
        raise RuntimeError(f"ffmpeg not found. Set FFMPEG_PATH in backend/.env. Tried: {ffmpeg}")
    except subprocess.CalledProcessError:
        raise RuntimeError("ffmpeg failed converting audio. Input might be empty/unsupported.")


@torch.inference_mode()
def transcribe_audio_file(file_path: str, language: Optional[str] = None) -> str:
    """
    Converts input audio -> 16k mono wav via ffmpeg, then reads wav via soundfile.
    Avoids torchaudio/torchcodec issues on Windows.
    """
    _load_mms_base()

    lang = (language or "eng").strip()
    _set_language(lang)

    with tempfile.TemporaryDirectory() as td:
        wav_path = os.path.join(td, "audio.wav")
        _ffmpeg_to_wav16k_mono(file_path, wav_path)

        # Read WAV using soundfile (returns numpy)
        audio, sr = sf.read(wav_path, dtype="float32")

        # Ensure mono
        if audio.ndim > 1:
            audio = np.mean(audio, axis=1)

        # ffmpeg forced sr=16000, but keep safe
        if sr != 16000:
            # if somehow not 16k, fail clearly
            raise RuntimeError(f"Expected 16000 Hz after ffmpeg conversion, got {sr} Hz")

        # Processor expects 1D float array for mono audio
        inputs = _processor(audio, sampling_rate=16000, return_tensors="pt")
        input_values = inputs.input_values.to(_device)

        logits = _model(input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)

        text = _processor.batch_decode(predicted_ids)[0]
        return (text or "").strip()
