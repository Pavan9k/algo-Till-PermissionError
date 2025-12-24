// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// export default function LiveTable() {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     const socket = io("http://localhost:5000");

//     socket.on("connect", () => {
//       console.log(" 🟢 Socket connected");
//     });

//     socket.on("ticks", (ticks) => {
//       setData((prev) => {
//         const u = { ...prev };
//         ticks.forEach((t) => (u[t.instrument_token] = t));
//         return u;
//       });
//     });

//     return () => socket.disconnect();
//   }, []);

//   return <pre>{JSON.stringify(Object.values(data), null, 2)}</pre>;
// }




import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getHistoricalData } from "./api";

export default function LiveTable() {
  const [candles, setCandles] = useState([]); // historical + live merged

  useEffect(() => {
    // ---------------- FETCH HISTORICAL ----------------
   const fetchHistorical = async () => {
  try {
    const res = await getHistoricalData(
      5633,                      // instrumentToken
      "day",                     // interval
      "2025-01-01 09:15:00",     // from
      "2025-12-01 15:30:00"      // to
    );

    setCandles(res.data.candles || []);
  } catch (err) {
    console.error("Error fetching historical:", err.response?.data || err.message);
  }
};


    fetchHistorical();

    // ---------------- SOCKET.IO ----------------
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
    });

    socket.on("ticks", (ticks) => {
      setCandles((prev) => {
        const updated = [...prev];

        ticks.forEach((tick) => {
          const lastCandle = updated[updated.length - 1];

          if (!lastCandle) return;

          const [time, open, high, low, close, volume] = lastCandle;

          // Merge tick into last candle (simple example)
          if (tick.last_price > high) lastCandle[2] = tick.last_price;
          if (tick.last_price < low) lastCandle[3] = tick.last_price;
          lastCandle[4] = tick.last_price; // close
          lastCandle[5] += tick.volume;    // add volume
        });

        return updated;
      });
    });

    return () => {
      socket.disconnect();
      console.log("🔴 Socket disconnected");
    };
  }, []);

  return (
    <pre style={{ fontSize: 12 }}>
      {JSON.stringify(candles, null, 2)}
    </pre>
  );
}
 