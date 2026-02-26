import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchItineraryItems,
  deleteItineraryItem,
} from "@/api/itinerayservices";
import { Globe } from "lucide-react";

import DaySection from "./DaySection";

const groupByDay = (items = []) => {
  return items.reduce((acc, item) => {
    const day = item.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});
};

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "bn", name: "Bengali" },
  { code: "gu", name: "Gujarati" },
  { code: "mr", name: "Marathi" },
  { code: "pa", name: "Punjabi" },
];

const ItineraryPage = () => {
  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translating, setTranslating] = useState(false);

  /* ================= LOAD TIMELINE ================= */
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchItineraryItems(id);
        setItems(data || []);
        // Set first day as selected
        if (data && data.length > 0) {
          const days = groupByDay(data);
          const firstDay = Math.min(...Object.keys(days).map(Number));
          setSelectedDay(firstDay);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [id]);

  /* ================= DELETE ================= */
  const handleDelete = async (itemId) => {
    try {
      await deleteItineraryItem(id, itemId);
      setItems((prev) =>
        prev.filter((i) => i.id !== itemId)
      );
    } catch {
      alert("Failed to delete activity");
    }
  };

  /* ================= TRANSLATE ================= */
  const handleTranslate = async (language) => {
    if (language === "en") {
      // Reset to original English
      setSelectedLanguage("en");
      window.location.reload();
      return;
    }

    setTranslating(true);
    try {
      const langName = LANGUAGES.find(l => l.code === language)?.name || language;
      console.log(`[DEBUG] Translating to ${langName}...`);
      console.log(`[DEBUG] API URL: ${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}`);
      console.log(`[DEBUG] Itinerary ID: ${id}`);
      
      const apiUrl = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/itineraries/${id}/translate`;
      console.log(`[DEBUG] Full URL: ${apiUrl}`);
      
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      console.log(`[DEBUG] Token present: ${!!token}`);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_language: langName,
        }),
      });

      console.log(`[DEBUG] Response status: ${response.status}`);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error(`[DEBUG] Error response:`, error);
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      const translatedData = await response.json();
      console.log(`[DEBUG] Translation successful, items: ${translatedData.items?.length || 0}`);
      setItems(translatedData.items || []);
      setSelectedLanguage(language);
    } catch (err) {
      console.error("Translation error:", err);
      alert(`Failed to translate: ${err.message}`);
    } finally {
      setTranslating(false);
    }
  };

  const grouped = groupByDay(items);
  const days = Object.keys(grouped).sort((a, b) => a - b);

  if (loading) return <div className="p-10">Loading timeline...</div>;

  return (
    <div className="p-10 space-y-6">
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Itinerary</h1>
        <div className="flex items-center gap-3">
          <Globe size={20} className="text-slate-600" />
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              handleTranslate(e.target.value);
            }}
            disabled={translating}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Day-wise Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(Number(day))}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedDay === Number(day)
                ? "bg-yellow-400 text-black"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      {/* Content */}
      {translating && (
        <div className="text-center py-8">
          <p className="text-slate-600">Translating...</p>
        </div>
      )}

      {!translating && selectedDay && grouped[selectedDay] && (
        <DaySection
          day={selectedDay}
          items={grouped[selectedDay]}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ItineraryPage;