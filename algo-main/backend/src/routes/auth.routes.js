import express from "express";
import { kite } from "../config/kite.js";
import { saveToken } from "../services/token.service.js";

console.log("🔥 AUTH ROUTE FILE LOADED");

export const authRoutes = (startTicker) => {
  const router = express.Router();

  router.get("/login", (_, res) => {
    res.redirect(kite.getLoginURL());
  });

  router.get("/login-success", async (req, res) => {
    try {
      const { request_token } = req.query;

      if (!request_token) {
        return res.status(400).send("Missing request token");
      }

      const session = await kite.generateSession(
        request_token,
        process.env.KITE_API_SECRET
      );

      kite.setAccessToken(session.access_token);
      saveToken(session.access_token);
      startTicker(session.access_token);

      //  SUCCESS → go back to frontend
      return res.redirect("http://localhost:5173/");
    } catch (err) {
      console.error("❌ Zerodha login failed");
      console.error(err);

      //  NEVER send the error object
      return res
        .status(500)
        .send("Zerodha login failed. Check backend logs.");
    }
  });

  return router;
};
