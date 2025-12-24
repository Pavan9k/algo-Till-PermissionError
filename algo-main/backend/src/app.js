import express from "express";
import cors from "cors";
import dataRoutes from "./routes/data.routes.js";
import statusRoutes from "./routes/status.routes.js";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (_, res) => res.json({ status: "ok" }));

  app.use(dataRoutes);
  app.use(statusRoutes);

  return app;
};
