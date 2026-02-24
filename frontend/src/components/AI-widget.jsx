import React, { useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Mic,
  Loader2,
} from "lucide-react";

// Added transcribeAudio to imports
import { sendMessageToAssistant, transcribeAudio } from "@/api/chatbotAPI";
import { startRecording, stopRecording } from "@/utils/audioRecorder";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hey Explorer! Need to transcribe a voice note or plan a route?",
    },
  ]);

  const handleChatSend = async () => {
    if (!message.trim()) return;
    const userText = message;
    setMessage("");

    setMessages((prev) => [...prev, { id: Date.now(), type: "user", text: userText }]);
    setIsTyping(true);

    try {
      const response = await sendMessageToAssistant(userText, "session-123");
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "bot", text: response.reply },
      ]);
    } catch {
      showError();
    } finally {
      setIsTyping(false);
    }
  };

  // =========================
  // UPDATED: SEND AUDIO → BACKEND
  // =========================
  const sendAudioToBackend = async (audioBlob) => {
    setIsTyping(true);

    try {
      // Using centralized API utility
      const transcribedText = await transcribeAudio(audioBlob);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          text: transcribedText || "Transcription completed.",
        },
      ]);
    } catch (err) {
      console.error(err);
      showError();
    } finally {
      setIsTyping(false);
    }
  };

  const showError = () => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "bot", text: "Odyssey network error. Check your backend." },
    ]);
  };

  const handleMicClick = async () => {
    if (!isRecording) {
      setIsRecording(true);
      await startRecording((audioBlob) => {
        sendAudioToBackend(audioBlob);
      });
    } else {
      stopRecording();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* HEADER */}
          <div className="bg-black p-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#FFD700] p-1.5 rounded-lg shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <Sparkles size={16} className="text-black" />
              </div>
              <span className="text-white font-black text-sm uppercase tracking-tight">Odyssey Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} className="text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAFAFA]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.type === "user" ? "bg-black text-white rounded-tr-none" : "bg-white border shadow-sm rounded-tl-none"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center text-gray-400 italic text-xs pl-2 font-bold uppercase tracking-widest">
                <Loader2 size={14} className="animate-spin" /> Odyssey is processing...
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-4 bg-white border-t flex items-center gap-2">
            <button onClick={handleMicClick} className={`p-2 rounded-full transition-all ${isRecording ? "bg-red-50 text-red-500" : "hover:bg-gray-100"}`}>
              <Mic size={20} className={isRecording ? "animate-pulse" : "text-gray-400"} />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder={isRecording ? "Listening..." : "Type or speak..."}
                className="w-full bg-gray-50 rounded-full py-3 px-5 pr-12 text-sm focus:ring-2 focus:ring-[#FFD700] outline-none border-none"
              />
              <button onClick={handleChatSend} className="absolute right-2 top-1.5 p-1.5 bg-black text-[#FFD700] rounded-full hover:scale-105 transition-transform">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="p-5 bg-[#FFD700] rounded-full shadow-xl hover:rotate-12 transition-all active:scale-95">
        <MessageSquare size={28} className="text-black" />
      </button>
    </div>
  );
};

export default ChatWidget;