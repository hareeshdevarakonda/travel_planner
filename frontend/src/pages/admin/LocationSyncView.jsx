import React, { useState } from "react";
import { createCountry } from "@/api/locationsync";

/* =====================================================
   LOCATION SYNC VIEW
===================================================== */
const LocationSyncView = () => {
  const [countryName, setCountryName] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  /* ================= SYNC COUNTRY ================= */
  const handleAddCountry = async (e) => {
    e.preventDefault();

    if (!countryName.trim()) return;

    try {
      setSyncing(true);
      setMessage(null);

      await createCountry(countryName);

      setCountryName("");
      setMessage({
        type: "success",
        text: "Country synced successfully ✅",
      });

    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Sync failed",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in">

      {/* HEADER */}
      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-3">
        Geography Control
      </p>

      <h2 className="text-4xl font-black mb-10">
        Location Sync
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleAddCountry}
        className="flex gap-4"
      >
        <input
          className="flex-1 p-4 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 ring-[#FFD700]"
          placeholder="e.g. Switzerland"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
        />

        <button
          disabled={syncing}
          className="bg-black text-[#FFD700] px-8 rounded-xl font-black uppercase text-xs disabled:opacity-60"
        >
          {syncing ? "Syncing..." : "Sync"}
        </button>
      </form>

      {/* STATUS MESSAGE */}
      {message && (
        <p
          className={`mt-4 text-xs font-bold uppercase tracking-widest
            ${
              message.type === "success"
                ? "text-emerald-600"
                : "text-red-500"
            }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default LocationSyncView;