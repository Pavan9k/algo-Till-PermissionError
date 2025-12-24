import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: false
});

// -------- AUTH --------
export const getProfile = () => api.get("/profile");

// -------- STATUS --------
export const getStatus = () => api.get("/status");

export const getHistoricalData = (instrumentToken, interval, from, to) => {
  return api.get("/historical", {
    params: {
      instrumentToken,
      interval,
      from,
      to,
    },
  });
};

// (optional for later)
// export const getHoldings = () => api.get("/holdings");
// export const getPositions = () => api.get("/positions");

export default api;
