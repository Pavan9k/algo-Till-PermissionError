import express from "express";
import kite from "../kite.js";

const router = express.Router();

router.get("/historical", async (req, res) => {
  try {
    const { instrumentToken, interval, from, to } = req.query;

    const data = await kite.getHistoricalData(
      instrumentToken,
      from,
      to,
      interval
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Failed to fetch historical data",
    });
  }
});

export default router;
