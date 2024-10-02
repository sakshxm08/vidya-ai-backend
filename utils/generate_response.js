import axios from "axios";

export const getAIResponse = async (chat, message) => {
  const API_URL = process.env.AI_API_URL;

  const thread_id = chat.threadId;

  // The body that needs to be passed to the API
  const requestBody = {
    config_id: "config",
    thread_id, // Dynamically generated thread_id
    messages: [
      {
        role: "user",
        content: message, // The user input passed to the function
      },
    ],
  };

  try {
    const response = await axios.post(API_URL, requestBody);
    return response.data?.messages[0].content; // Adjust this based on the API's response format
  } catch (error) {
    throw new Error("Failed to fetch AI response");
  }
};
