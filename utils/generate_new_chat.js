import Chat from "../models/chat.model.js";
import { generateThreadId } from "./generate_thread_id.js";

const generate_new_chat = async (user) => {
  let latestChat = await Chat.findOne({ userId: user?._id }).sort({
    createdAt: -1,
  });
  if (!latestChat || (latestChat.messages && latestChat.messages.length > 0)) {
    // Create a new chat if no empty chat exists
    const threadId = generateThreadId();
    latestChat = new Chat({ userId: user?._id, threadId });
    await latestChat.save();
  }

  return latestChat;
};

export default generate_new_chat;
