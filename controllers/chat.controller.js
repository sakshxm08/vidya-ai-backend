// controllers/chatController.js
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { getAIResponse } from "../utils/generate_response.js";
import generate_new_chat from "../utils/generate_new_chat.js";
import { generateThreadId } from "../utils/generate_thread_id.js";

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const user = req.user; // Assuming verifyToken middleware is used

    if (!user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Fetch the latest chat for the user
    const chat = generate_new_chat(user);

    return res.status(201).json({ chat });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({ error: "Failed to create chat" });
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
      const threadId = generateThreadId();
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
      message: message,
    });

    await userMessage.save();

    // Push the message ID into the Chat's messages array
    await Chat.updateOne(
      { _id: chat._id },
      { $push: { messages: userMessage._id } } // Add the message ID to the messages array
    );

    // Send user message to the AI API and get the response
    let aiResponse = await getAIResponse(chat, message);

    if (aiResponse.startsWith("bot")) {
      const firstQuoteIndex = aiResponse.indexOf('"'); // Find the index of the first double quote
      aiResponse = aiResponse.slice(firstQuoteIndex); // Keep everything from the first double quote onwards
    }
    if (aiResponse.endsWith('"') && aiResponse.startsWith('"')) {
      aiResponse = aiResponse.slice(1, aiResponse.length - 1);
    }

    // Save AI response message
    const aiMessage = new Message({
      chatId: chat._id,
      role: "ai",
      message: aiResponse,
    });

    await aiMessage.save();

    // Push the AI message ID into the Chat's messages array
    await Chat.updateOne(
      { _id: chat._id },
      { $push: { messages: aiMessage._id } } // Add the AI message ID to the messages array
    );

    // Return response to client
    res.status(200).json({
      success: true,
      chatId: chat._id,
      message: userMessage.message,
      response: aiMessage.message,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process message" });
  }
};
