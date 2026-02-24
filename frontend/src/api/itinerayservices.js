import api from "./axios";

/* =====================================================
   COMMON REQUEST HANDLER
   Prevents repetition + centralized error handling
===================================================== */
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error("API Error:", error);

    // backend error message if exists
    const message =
      error.response?.data?.detail ||
      error.response?.data ||
      "Something went wrong";

    throw message;
  }
};

/* =====================================================
   FETCH ALL USER ITINERARIES
   GET /itineraries/
===================================================== */
export const fetchUserItineraries = () =>
  handleRequest(api.get("/itineraries/"));

/* =====================================================
   FETCH USER DEFAULT ITINERARY (if backend supports)
   GET /itineraries/user
===================================================== */
export const fetchUserItinerary = () =>
  handleRequest(api.get("/itineraries/user"));

/* =====================================================
   FETCH SINGLE ITINERARY
   GET /itineraries/{id}
===================================================== */
export const fetchItineraryById = (id) =>
  handleRequest(api.get(`/itineraries/${id}`));

/* =====================================================
   FETCH ITINERARY ITEMS (Timeline)
   GET /itineraries/{id}/items
===================================================== */
export const fetchItineraryItems = (id) =>
  handleRequest(api.get(`/itineraries/${id}/items`));

/* =====================================================
   CREATE NEW ITINERARY
   POST /itineraries/
===================================================== */
export const createItinerary = (data) =>
  handleRequest(api.post("/itineraries/", data));

/* =====================================================
   UPDATE ITINERARY
   PUT /itineraries/{id}
===================================================== */
export const updateItinerary = (id, data) =>
  handleRequest(api.put(`/itineraries/${id}`, data));

/* =====================================================
   DELETE ITINERARY
   DELETE /itineraries/{id}
===================================================== */
export const deleteItinerary = (id) =>
  handleRequest(api.delete(`/itineraries/${id}`));

/* =====================================================
   ADD CO-TRAVELLER
   POST /itineraries/{id}/co_travellers
===================================================== */
export const addCoTraveller = (id, travellerData) =>
  handleRequest(
    api.post(`/itineraries/${id}/co_travellers`, travellerData)
  );

/* =====================================================
   ADD ITINERARY ITEM (Activity / Timeline)
   POST /itineraries/{id}/items
===================================================== */
export const addItineraryItem = (id, itemData) =>
  handleRequest(
    api.post(`/itineraries/${id}/items`, itemData)
  );

/* =====================================================
   DELETE ITINERARY ITEM
   DELETE /itineraries/{id}/items/{item_id}
===================================================== */
export const deleteItineraryItem = (itineraryId, itemId) =>
  handleRequest(
    api.delete(
      `/itineraries/${itineraryId}/items/${itemId}`
    )
  );