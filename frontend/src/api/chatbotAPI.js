// src/api/chatbotAPI.js
import api from "./axios";

/**
 * TEXT CHAT → Groq LLM
 */
export const sendMessageToAssistant = async (
  userMessage,
  sessionId,
  currentContext = {}
) => {
  try {
    const response = await api.post("/ai/chat", {
      message: userMessage,
      context: currentContext, // REQUIRED by backend schema
      session_id: sessionId,
    });

    return response.data;
  } catch (error) {
    console.error("Assistant Communication Error:", error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.detail || "Chat service unavailable"
    );
  }
};

/**
 * 🎤 AUDIO → MMS TRANSCRIPTION
 */
export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();

    // MUST match FastAPI UploadFile name
    formData.append("audio", audioBlob, "voice.webm");
    formData.append("language", "eng");

    const response = await api.post("/ai/transcribe", formData, {
      // ❗ DO NOT manually set multipart headers
      headers: {
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Transcription Error:",
      error?.response?.data || error.message
    );

    throw new Error(
      error?.response?.data?.detail || "Voice transcription failed"
    );
  }
};