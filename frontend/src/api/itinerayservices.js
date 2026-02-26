import api from "./axios";

/* =====================================================
   COMMON REQUEST HANDLER
===================================================== */
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    const message =
      error.response?.data?.detail ||
      error.response?.data ||
      "Something went wrong";
    throw message;
  }
};

/* =====================================================
   ITINERARY ENDPOINTS
===================================================== */

export const fetchUserItineraries = () =>
  handleRequest(api.get("/itineraries/"));

export const fetchItineraryById = (id) =>
  handleRequest(api.get(`/itineraries/${id}`));

export const createItinerary = (data) =>
  handleRequest(api.post("/itineraries/", data));

export const updateItinerary = (id, data) =>
  handleRequest(api.put(`/itineraries/${id}`, data));

export const deleteItinerary = (id) =>
  handleRequest(api.delete(`/itineraries/${id}`));

/* =====================================================
   ITEM (TIMELINE) ENDPOINTS
===================================================== */

export const fetchItineraryItems = (id) =>
  handleRequest(api.get(`/itineraries/${id}/items`));

export const addItineraryItem = (id, itemData) =>
  handleRequest(api.post(`/itineraries/${id}/items`, itemData));

// MATCHES image_b38620.png
export const deleteItineraryItem = (itineraryId, itemId) =>
  handleRequest(api.delete(`/itineraries/${itineraryId}/items/${itemId}`));

/* =====================================================
   CO-TRAVELLER ENDPOINTS
===================================================== */

export const addCoTraveller = (id, travellerData) =>
  handleRequest(api.post(`/itineraries/${id}/co_travellers`, travellerData));

// NEW: MATCHES image_b3856f.png
export const removeCoTraveller = (itineraryId, userId) =>
  handleRequest(api.delete(`/itineraries/${itineraryId}/co_travellers/${userId}`));