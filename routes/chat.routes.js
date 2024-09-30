// routes/chat.js
import express from "express";
import {
  createChat,
  getChats,
  getMessagesForChat,
  sendUserMessage,
} from "../controllers/chat.controller.js";
import { verify_token } from "../middlewares/verify_token.js";

const router = express.Router();

router.post("/new-chat", verify_token, createChat); // Create a new chat
router.get("/", verify_token, getChats); // Get all chats for the logged-in user
router.get("/:chatId/messages", verify_token, getMessagesForChat); // Get messages for a specific chat
router.post("/:chatId/send-message", verify_token, sendUserMessage);

export default router;
