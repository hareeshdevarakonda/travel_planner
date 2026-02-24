// src/utils/searchUtils.js

/* =====================================================
   FILTER PLACES BY SEARCH QUERY
===================================================== */
export const filterPlaces = (places, query) => {
  if (!query) return [];

  const lowerQuery = query.toLowerCase();

  return places.filter((place) =>
    place.name.toLowerCase().includes(lowerQuery)
  );
};


/* =====================================================
   LIMIT RESULTS (FOR DROPDOWN PERFORMANCE)
===================================================== */
export const limitResults = (results, limit = 6) => {
  return results.slice(0, limit);
};