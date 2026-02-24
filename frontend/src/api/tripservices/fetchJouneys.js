// 1. Import your custom axios instance (the 'Security Guard')
import api from './axios'; 

/**
 * Fetches the user's travel history.
 * The 'api' instance automatically attaches the token and handles refreshes.
 */
export const fetchJourneyHistory = async () => {
  try {
    // 2. Just call the endpoint. No manual headers needed!
    // Since you mentioned your backend expects a POST with a message:
    const response = await api.post('/journeys/history', {
      message: "my journeys"
    });

    // 3. Return the response which contains { token, history }
    return response.data;
  } catch (error) {
    console.error("API Error in fetchJourneyHistory:", error);
    throw error; 
  }
};