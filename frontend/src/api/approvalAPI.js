import api from "./axios";

/* ==============================
   COMMON HANDLER
============================== */
const handleRequest = async (request) => {
  try {
    const res = await request;
    return res.data;
  } catch (error) {
    console.error("Approval API Error:", error);

    throw (
      error?.response?.data?.detail ||
      "Approval action failed"
    );
  }
};

/* ==============================
   GET PENDING APPROVALS
============================== */
export const fetchPendingApprovals = () =>
  handleRequest(api.get("/approvals/pending"));

/* ==============================
   APPROVE ITEM
============================== */
export const approveItem = (approvalId) =>
  handleRequest(
    api.post(`/approvals/${approvalId}/approve`)
  );

/* ==============================
   REJECT ITEM
============================== */
export const rejectItem = (approvalId) =>
  handleRequest(
    api.post(`/approvals/${approvalId}/reject`)
  );