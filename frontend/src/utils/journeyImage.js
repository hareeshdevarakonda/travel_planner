const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "";

export const resolveJourneyImage = (journey) => {
  // already provided
  if (journey.image) return journey.image;

  // try first itinerary item
  const firstItem = journey.items?.[0];

  if (firstItem?.place?.image_url) {
    const url = firstItem.place.image_url;

    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  }

  // fallback dynamic endpoint
  if (firstItem?.place_id) {
    return `${API_BASE}/places/${firstItem.place_id}/image`;
  }

  return null;
};