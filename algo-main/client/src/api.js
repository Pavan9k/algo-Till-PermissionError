import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: false
});

// -------- AUTH --------
export const getProfile = () => api.get("/profile");

// -------- STATUS --------
export const getStatus = () => api.get("/status");

//----Historical Data

// ---- Historical Data ----
/**
 * Fetch historical candles for an instrument
 * @param {string} instrumentToken - The instrument token (e.g., "5633")
 * @param {string} interval - Candle interval ("minute", "5minute", "daily", etc.)
 * @param {string} from - Start date/time in "yyyy-mm-dd hh:mm:ss" format
 * @param {string} to - End date/time in "yyyy-mm-dd hh:mm:ss" format
 * @param {number} oi - Optional, 0 or 1 to include Open Interest
 * @returns Promise resolving to { candles: [...] }
 */
export const getHistoricalData = (instrumentToken, interval, from, to, oi = 1) => {
  return api.get(`/historical/${instrumentToken}/${interval}`, {
    params: { from, to, oi }
  });
};

// ---- Get all instruments ----
export const getAllInstruments = async () => {
  return api.get("/instruments"); // Your backend route that returns all instruments
};





// (optional for later)
// export const getHoldings = () => api.get("/holdings");
// export const getPositions = () => api.get("/positions");

export default api;
