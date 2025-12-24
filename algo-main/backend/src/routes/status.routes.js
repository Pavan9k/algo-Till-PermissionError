import express from "express";
import { runtime } from "../services/runtime.service.js";

const router = express.Router();

router.get("/status", (_, res) => res.json(runtime));

export default router;
