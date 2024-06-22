import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "users",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "users",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "messages",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = new mongoose.model("conversations", conversationSchema);

export default Conversation;
