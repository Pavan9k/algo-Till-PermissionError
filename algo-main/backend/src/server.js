process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { authRoutes } from "./routes/auth.routes.js";
import { loadToken } from "./services/token.service.js";
import { startTicker } from "./services/ticker.service.js";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

io.on("connection", (socket) => {
  console.log("🖥️ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});


loadToken(token => startTicker(token, io));
app.use(authRoutes(token => startTicker(token, io)));

server.listen(5000, () => {
  console.log("🚀 Backend running on 5000");
});
