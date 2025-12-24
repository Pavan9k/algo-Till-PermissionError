// import { KiteTicker } from "kiteconnect";
// import { setConnected, setDisconnected, updateTickTime } from "./runtime.service.js";
// import { INSTRUMENT_TOKENS } from "../instruments/instruments.js";

// let ticker;

// export const startTicker = (token, io) => {
//   if (ticker) return;

//   ticker = new KiteTicker({
//     api_key: process.env.KITE_API_KEY,
//     access_token: token
//   });

//   ticker.on("connect", () => {
//     setConnected();
//     ticker.subscribe(INSTRUMENT_TOKENS);
//     ticker.setMode(ticker.modeFull, INSTRUMENT_TOKENS);
//   });

//   ticker.on("ticks", (ticks) => {
//     updateTickTime();
//     io.emit("ticks", ticks);
//   });

//   ticker.on("disconnect", setDisconnected);
//   ticker.on("error", setDisconnected);

//   ticker.on("connect", () => {
//   console.log("🟢 CONNECT EVENT FIRED");
//   setConnected();
// });
// console.log("🚀 startTicker called");


//   ticker.connect();
// };


  import { KiteTicker } from "kiteconnect";
import {
  setConnected,
  setDisconnected,
  updateTickTime
} from "./runtime.service.js";
import { INSTRUMENT_TOKENS } from "../instruments/instruments.js";

let ticker;

const isMarketOpen = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return (
    (hours > 9 || (hours === 9 && minutes >= 15)) &&
    (hours < 15 || (hours === 15 && minutes <= 30))
  );
};

export const startTicker = (token, io) => {
  if (ticker) {
    console.log("ℹ️ Ticker already running, skipping start");
    return;
  }

  if (!isMarketOpen()) {
    console.log("⏰ Market closed. Ticker will not connect.");
    setDisconnected();
    return;
  }

  console.log("🚀 startTicker called");

  ticker = new KiteTicker({
    api_key: process.env.KITE_API_KEY,
    access_token: token
  });

  ticker.on("connect", () => {
    console.log("🟢 Ticker connected");

    setConnected();

    ticker.subscribe(INSTRUMENT_TOKENS);
    ticker.setMode(ticker.modeFull, INSTRUMENT_TOKENS);
  });

  ticker.on("ticks", (ticks) => {
    updateTickTime();
    io.emit("ticks", ticks);
  });

  ticker.on("disconnect", () => {
    console.log("🔴 Ticker disconnected");
    setDisconnected();
  });

  ticker.on("error", (err) => {
    console.error("❌ Ticker error", err?.message || err);
    setDisconnected();
  });

  ticker.connect();
};
