// // import express from "express";
// // import { kite } from "../config/kite.js";

// // const router = express.Router();

// // router.get("/profile", async (_, res) => {
// //   const profile = await kite.getProfile();
// //   res.json(profile);   // ✅ MUST be res.json
// // });

// // router.get("/holdings", async (_, res) => {
// //   const holdings = await kite.getHoldings();
// //   res.json(holdings);  // ✅
// // });

// // router.get("/positions", async (_, res) => {
// //   const positions = await kite.getPositions();
// //   res.json(positions); // ✅
// // });



// // export default router;




// import express from "express";
// import { kite } from "../config/kite.js";

// const router = express.Router();

// // ---------------- PROFILE ----------------
// router.get("/profile", async (_, res) => {
//   try {
//     const profile = await kite.getProfile();
//     res.json(profile);
//   } catch (err) {
//     console.error("Error fetching profile:", err);
//     res.status(500).json({ error: err.message || "Failed to fetch profile" });
//   }
// });

// // ---------------- HOLDINGS ----------------
// router.get("/holdings", async (_, res) => {
//   try {
//     const holdings = await kite.getHoldings();
//     res.json(holdings);
//   } catch (err) {
//     console.error("Error fetching holdings:", err);
//     res.status(500).json({ error: err.message || "Failed to fetch holdings" });
//   }
// });

// // ---------------- POSITIONS ----------------
// router.get("/positions", async (_, res) => {
//   try {
//     const positions = await kite.getPositions();
//     res.json(positions);
//   } catch (err) {
//     console.error("Error fetching positions:", err);
//     res.status(500).json({ error: err.message || "Failed to fetch positions" });
//   }
// });

// // ---------------- HISTORICAL DATA ----------------


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
    res.status(500).json({ error: err.message });
  }
});

// ---------------- HOLDINGS ----------------
router.get("/holdings", async (_, res) => {
  try {
    const holdings = await kite.getHoldings();
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- POSITIONS ----------------
router.get("/positions", async (_, res) => {
  try {
    const positions = await kite.getPositions();
    res.json(positions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/instruments", async (req, res) => {
//   try {
//     const offset = parseInt(req.query.offset) || 0;
//     const limit = parseInt(req.query.limit) || 15;

//     const instruments = await kite.getInstruments(); // full array
//     const paged = instruments.slice(offset, offset + limit);

//     res.json({
//       instruments: paged,
//       total: instruments.length
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// ---------------- HISTORICAL DATA (WITH OI) ----------------

router.get("/instruments", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 15;
    const keyword = (req.query.keyword || "").toLowerCase().trim();

    const instruments = await kite.getInstruments(); // full array

    // Split keyword by spaces for multi-word search
    const searchWords = keyword ? keyword.split(/\s+/) : [];

    // Filter instruments
    const filtered = instruments.filter(inst => {
      const symbol = inst.tradingsymbol?.toLowerCase() || "";
      const name = inst.name?.toLowerCase() || "";

      // Every search word must appear in either symbol or name
      return searchWords.every(word => symbol.includes(word) || name.includes(word));
    });

    // Pagination after filtering
    const paged = filtered.slice(offset, offset + limit);

    res.json({
      instruments: paged,
      total: filtered.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// router.get("/historical/:instrument_token/:interval", async (req, res) => {
//   const { instrument_token, interval } = req.params;
//   const { from, to, oi = 0, continuous = 0 } = req.query; // default continuous = 0

//   if (!from || !to) {
//     return res.status(400).json({ error: "'from' and 'to' query parameters are required" });
//   }

//   try {
//     const candles = await kite.getHistoricalData(
//       instrument_token,
//       interval,
//       from,
//       to,
//       oi,
//       continuous // Pass explicitly
//     );

//     res.json({ candles });
//   } catch (err) {
//     console.error("Error fetching historical data:", err);
//     res.status(500).json({ error: err.message || "Failed to fetch historical data" });
//   }
// });

router.get("/historical/:instrument_token/:interval", async (req, res) => {
  const { instrument_token, interval } = req.params;
  const { from, to, oi = 1, continuous = 0 } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "'from' and 'to' query parameters are required" });
  }

  try {
    const oiNum = parseInt(oi) || 0;
    const continuousNum = parseInt(continuous) || 0;

    const candles = await kite.getHistoricalData(
      instrument_token,
      interval,
      from,
      to,
      oiNum,
      continuousNum
    );

    res.json({ candles });
  } catch (err) {
    console.error("Error fetching historical data:", err);
    res.status(500).json({ error: err.message || "Failed to fetch historical data" });
  }
});





export default router;

