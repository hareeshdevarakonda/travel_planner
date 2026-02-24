/**
 * Removes a trip from the database.
 * @param {string} id - The unique ID of the itinerary.
 */
export const deleteJourney = async (id) => {
  try {
    // Hits the DELETE /itineraries/{itinerary_id} endpoint
    const response = await api.delete(`/itineraries/${id}`); 
    return response.data;
  } catch (error) {
    console.error("Error deleting journey:", error);
    throw error;
  }
};