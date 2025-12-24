export const initSockets = (io) => {
  io.on("connection", () => {
    console.log("🖥️ Client connected");
  });
};
