import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user1: { type: String, required: true },
  user2: { type: String, required: true },
  messages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
