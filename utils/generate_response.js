import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const getAIResponse = async (message) => {
  const API_URL = process.env.AI_API_URL;

  // Generate a unique thread_id dynamically using uuid
  const thread_id = uuidv4();

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
