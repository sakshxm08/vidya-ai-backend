// controllers/chatController.js
import Chat from "../models/chat.model.js";
import { getAIResponse } from "../utils/generate_response.js";

export const sendUserMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id; // Assuming user ID is added by verify_token middleware

  try {
    // Send user message to the AI API and get the response
    const aiResponse = await getAIResponse(message);

    // Save chat history in DB
    const newChat = new Chat({
      userId,
      message,
      aiResponse,
    });

    await newChat.save();

    // Send the AI response back to the client
    res.status(200).json({
      success: true,
      message: newChat.message,
      aiResponse: newChat.aiResponse,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process message" });
  }
};
