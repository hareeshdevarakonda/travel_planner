import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import {
  fetchPendingApprovals,
  approveItem,
  rejectItem,
} from "@/api/approvalAPI";

/* =====================================================
   APPROVAL ROW (UI ONLY)
===================================================== */
const ApprovalRow = ({ item, processing, onApprove, onReject }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:border-black transition shadow-sm">

      {/* LEFT */}
      <div>
        <h3 className="font-semibold text-base text-black">
          {item.title || "Pending Item"}
        </h3>

        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
          {item.type || "CONTENT"}
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3">

        <button
          disabled={processing}
          onClick={onApprove}
          className="px-3 py-1 rounded-md text-[10px] font-bold uppercase
                     bg-emerald-100 text-emerald-700
                     disabled:opacity-50"
        >
          {processing ? "..." : "Approve"}
        </button>

        <button
          disabled={processing}
          onClick={onReject}
          className="px-3 py-1 rounded-md text-[10px] font-bold uppercase
                     bg-red-100 text-red-700
                     disabled:opacity-50"
        >
          Reject
        </button>

        <ChevronRight size={16} />
      </div>
    </div>
  );
};

/* =====================================================
   MAIN APPROVALS VIEW (API CONNECTED)
===================================================== */
const ApprovalsView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  /* ================= LOAD APPROVALS ================= */
  useEffect(() => {
    const loadApprovals = async () => {
      try {
        const data = await fetchPendingApprovals();
        setItems(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load approvals");
      } finally {
        setLoading(false);
      }
    };

    loadApprovals();
  }, []);

  /* ================= ACTION HANDLER ================= */
  const handleAction = async (id, action) => {
    try {
      setProcessingId(id);

      if (action === "approve") {
        await approveItem(id);
      } else {
        await rejectItem(id);
      }

      // optimistic UI update
      setItems(prev => prev.filter(item => item.id !== id));

    } catch (err) {
      alert(err);
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
        Loading Approvals...
      </p>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">

      {/* HEADER */}
      <div className="mb-10">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-3">
          Moderation Queue
        </p>

        <h2 className="text-4xl font-black">
          Pending Approvals
        </h2>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            No pending approvals ✅
          </p>
        ) : (
          items.map(item => (
            <ApprovalRow
              key={item.id}
              item={item}
              processing={processingId === item.id}
              onApprove={() => handleAction(item.id, "approve")}
              onReject={() => handleAction(item.id, "reject")}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalsView;