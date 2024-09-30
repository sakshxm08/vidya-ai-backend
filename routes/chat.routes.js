// routes/chat.js
import express from "express";
import { sendUserMessage } from "../controllers/chat.controller.js";
import { verify_token } from "../middlewares/verify_token.js";

const router = express.Router();

// POST /api/chat/send-message
router.post("/send-message", verify_token, sendUserMessage);

export default router;
