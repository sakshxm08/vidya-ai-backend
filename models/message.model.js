const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // Link to the chat session
    sender: { type: String, enum: ["user", "ai"], required: true }, // User or AI
    message: { type: String, required: true }, // The content of the message
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
