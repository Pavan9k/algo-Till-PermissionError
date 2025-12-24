// import express from "express";
// import { kite } from "../config/kite.js";

// const router = express.Router();

// router.get("/profile", async (_, res) => {
//   const profile = await kite.getProfile();
//   res.json(profile);   // ✅ MUST be res.json
// });

// router.get("/holdings", async (_, res) => {
//   const holdings = await kite.getHoldings();
//   res.json(holdings);  // ✅
// });

// router.get("/positions", async (_, res) => {
//   const positions = await kite.getPositions();
//   res.json(positions); // ✅
// });



// export default router;




import express from "express";
import { kite } from "../config/kite.js";

const router = express.Router();

// ---------------- PROFILE ----------------
router.get("/profile", async (_, res) => {
  try {
    const profile = await kite.getProfile();
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: err.message || "Failed to fetch profile" });
  }
});

// ---------------- HOLDINGS ----------------
router.get("/holdings", async (_, res) => {
  try {
    const holdings = await kite.getHoldings();
    res.json(holdings);
  } catch (err) {
    console.error("Error fetching holdings:", err);
    res.status(500).json({ error: err.message || "Failed to fetch holdings" });
  }
});

// ---------------- POSITIONS ----------------
router.get("/positions", async (_, res) => {
  try {
    const positions = await kite.getPositions();
    res.json(positions);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ error: err.message || "Failed to fetch positions" });
  }
});

// ---------------- HISTORICAL DATA ----------------
router.get("/historical", async (req, res) => {
  try {
    const { instrumentToken, interval, from, to } = req.query;

    // Validate query parameters
    if (!instrumentToken || !interval || !from || !to) {
      return res.status(400).json({
        error: "Missing required query parameters: instrumentToken, interval, from, to",
      });
    }

    const data = await kite.getHistoricalData(
      Number(instrumentToken), // ensure it's a number
      from,
      to,
      interval
    );

    res.json(data);
  } catch (err) {
    console.error("Error fetching historical data:", err);
    res.status(500).json({
      error: err.message || "Failed to fetch historical data",
    });
  }
});

export default router;
