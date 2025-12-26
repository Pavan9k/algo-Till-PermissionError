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
import {  getStatus } from "./api";
import { formatKiteDate } from "../utils";

export default function LiveTable() {
  const [ticks, setTicks] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // ---------------- FETCH HISTORICAL ----------------
 


    // ---------------- POLL STATUS ----------------
    // const statusInterval = setInterval(async () => {
    //   try {
    //     const res = await getStatus();
    //     setStatus(res.data);
    //     console.log("Status:", res.data);
    //   } catch (err) {
    //     console.error("Error fetching status:", err.response?.data || err.message);
    //   }
    // }, 5000); // Fixed: 5000ms = 5 seconds (was 500000)

    // ---------------- LIVE TICKS ----------------
    const socket = io("http://localhost:5000");

    socket.on("connect", () => console.log("🟢 Socket connected"));

    let lastUpdate = 0;
    const throttleMs = 200;

    // socket.on("ticks", (incomingTicks) => {
    //   const now = Date.now();
    //   if (now - lastUpdate < throttleMs) return;
    //   lastUpdate = now;

    //   setTicks(incomingTicks);
    // });

    // ---------------- CLEANUP ----------------
    return () => {
      socket.disconnect();
      clearInterval(statusInterval);
      console.log("🔴 Socket disconnected, status polling stopped");
    };
  }, []);

  return (
    <div>
      <h3>Live Ticks:</h3>
      {/* <pre style={{ fontSize: 12 }}>{JSON.stringify(ticks, null, 2)}</pre> */}

      <h3>Status:</h3>
      <pre style={{ fontSize: 12 }}>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}