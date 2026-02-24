// src/api/searchApi.js

import api from "./axios";

/* =====================================================
   BASE URL (for image endpoints if backend returns relative paths)
===================================================== */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "";

/* =====================================================
   COMMON ERROR FORMATTER
===================================================== */
const formatApiError = (error) => {
  console.error("API Error:", error);

  return (
    error?.response?.data?.detail ||
    error?.response?.data ||
    error?.message ||
    "Something went wrong"
  );
};

/* =====================================================
   RESOLVE IMAGE URL SAFELY
   Handles:
   - full URLs
   - relative media paths
   - missing image → fallback endpoint
===================================================== */
const resolveImage = (place) => {
  if (!place) return null;

  // backend may send full URL already
  if (place.image_url?.startsWith("http"))
    return place.image_url;

  if (place.thumbnail_url?.startsWith("http"))
    return place.thumbnail_url;

  // relative paths from backend
  if (place.image_url)
    return `${API_BASE}${place.image_url}`;

  if (place.thumbnail_url)
    return `${API_BASE}${place.thumbnail_url}`;

  // fallback dynamic endpoint
  if (place.id)
    return `${API_BASE}/places/${place.id}/image`;

  return null;
};

/* =====================================================
   FETCH PLACES BY CITY
   Backend: GET /places?city_id=XX
===================================================== */
export const fetchPlacesByCity = async (cityId) => {
  try {
    const { data } = await api.get("/places", {
      params: { city_id: cityId },
    });

    return (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      rating: p.rating ?? 0,
      location: p.address || p.city_name || "",
      image: resolveImage(p), // ⭐ IMAGE FIX
      raw: p,
    }));
  } catch (error) {
    throw formatApiError(error);
  }
};

/* =====================================================
   ADD PLACE AS ACTIVITY TO ITINERARY
   Backend: POST /itineraries/{id}/items
===================================================== */
export const addPlaceToItinerary = async (
  itineraryId,
  place,
  day = 1,
  existingItems = []
) => {
  try {
    const order =
      existingItems.filter((item) => item.day === day).length + 1;

    const payload = {
      place_id: place.id,
      day,
      order,
      note: `Visit ${place.name}`,
    };

    const { data } = await api.post(
      `/itineraries/${itineraryId}/items`,
      payload
    );

    return {
      success: true,
      activity: data,
      message: "Place added successfully",
      image: place.image, // ⭐ keep image for optimistic UI
    };
  } catch (error) {
    throw formatApiError(error);
  }
};