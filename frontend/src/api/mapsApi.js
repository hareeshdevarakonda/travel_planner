// api/mapsAPI.js
import api from './axios';

/**
 * Checks if the maps service is alive.
 */
export const pingMaps = async () => {
  try {
    const response = await api.get('/maps/ping');
    return response.data;
  } catch (error) {
    console.error("Maps Ping Error:", error);
    throw error;
  }
};

/**
 * Fetches the driving route between two points.
 */
export const fetchRouteData = async (source, destination) => {
  try {
    const response = await api.get('/maps/route', {
      params: { source, destination }
    });
    return response.data;
  } catch (error) {
    console.error("Route Fetch Error:", error);
    throw error;
  }
};