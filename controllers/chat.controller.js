// controllers/chatController.js
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { v4 as uuidv4 } from "uuid";
import { getAIResponse } from "../utils/generate_response.js";

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming verifyToken middleware is used
    const threadId = uuidv4();
    const chat = new Chat({ userId, threadId });
    await chat.save();

    res.status(201).json({ chat });
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};

// Get all chats for the logged-in user
export const getChats = async (req, res) => {
  try {
    const { userId } = req.user;
    const chats = await Chat.find({ userId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

// Get messages for a specific chat
export const getMessagesForChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendUserMessage = async (req, res) => {
  const { message } = req.body; // Accept chatId if it's an ongoing conversation
  const { chatId } = req.params;
  const userId = req.user._id; // Assuming user ID is added by verify_token middleware

  try {
    // Send user message to the AI API and get the response
    const aiResponse = await getAIResponse(message);

    let chat;

    // Check if a chatId exists, meaning it's an ongoing conversation
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });

      // If no chat is found, return an error (chatId could be invalid)
      if (!chat) {
        return res
          .status(404)
          .json({ success: false, error: "Chat not found" });
      }
    } else {
      // Create a new chat if chatId doesn't exist (new conversation)
      const threadId = uuidv4();
      chat = new Chat({
        userId,
        threadId,
      });
      await chat.save();
    }

    // Save user message
    const userMessage = new Message({
      chatId: chat._id,
      role: "user",
      content: message,
    });

    // Save AI response message
    const aiMessage = new Message({
      chatId: chat._id,
      role: "ai",
      content: aiResponse,
    });

    // Save both messages to DB
    await userMessage.save();
    await aiMessage.save();

    // Update chat's last updated time
    chat.updatedAt = new Date();
    await chat.save();

    // Return response to client
    res.status(200).json({
      success: true,
      chatId: chat._id,
      userMessage: userMessage.content,
      aiResponse: aiMessage.content,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process message" });
  }
};
