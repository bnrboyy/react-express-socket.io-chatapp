import express from "express";
import { Server } from "socket.io";
import http from "http";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import User from "../models/UserModel.js";
import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";

const app = express();

/** socket connection  */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

/***
 * socket running at http://localhost:8080/
 */

// online user
const onlineUsers = new Set();

io.on("connection", async (socket) => {
  console.log("socket connected", socket.id);

  const token = socket.handshake.auth.token;

  // current user details
  const user = await getUserDetailsFromToken(token);

  if (user) {
    // create a room
    socket.join(user?._id?.toString());
    onlineUsers.add(user?._id?.toString());

    io.emit("onlineUsers", Array.from(onlineUsers));

    socket.on("message-page", async (userId) => {
      const userDetails = await User.findById(userId).select("-password");

      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUsers.has(userDetails?._id?.toString()),
      };

      socket.emit("message-user", payload);

      // get previous message
      const getConversationMessage = await Conversation.findOne({
        $or: [
          {
            sender: user?._id,
            receiver: userId,
          },
          {
            sender: userId,
            receiver: user?._id,
          },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    });
  }

  // new message
  socket.on("new-message", async (data) => {
    // check conversation is available both user

    let conversation = await Conversation.findOne({
      $or: [
        {
          sender: data?.senderId,
          receiver: data?.receiverId,
        },
        {
          sender: data?.receiverId,
          receiver: data?.senderId,
        },
      ],
    });

    // if conversation is not available
    if (!conversation) {
      // create a new conversation
      const newConversation = new Conversation({
        sender: data?.senderId,
        receiver: data?.receiverId,
      });

      conversation = await newConversation.save();
    }

    const message = new Message({
      text: data?.message?.text,
      imageUrl: data?.message?.imageUrl,
      videoUrl: data?.message?.videoUrl,
      msgByUserId: data?.msgByUserId,
    });

    const saveMessage = await message.save();

    const updateConversation = await Conversation.updateOne(
      {
        _id: conversation?._id,
      },
      {
        $push: {
          messages: saveMessage?._id,
        },
      }
    );

    const getConversationMessage = await Conversation.findOne({
      $or: [
        {
          sender: data?.senderId,
          receiver: data?.receiverId,
        },
        {
          sender: data?.receiverId,
          receiver: data?.senderId,
        },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.senderId).emit(
      "message",
      getConversationMessage?.messages || []
    );
    io.to(data?.receiverId).emit(
      "message",
      getConversationMessage?.messages || []
    );
  });

  // sidebar
  socket.on("sidebar", async (currentUserId) => {
    console.log("currentUserId", currentUserId);

    if (currentUserId) {
      const currentUserCon = await Conversation.find({
        $or: [
          {
            sender: currentUserId,
          },
          {
            receiver: currentUserId,
          },
        ],
      })
        .sort({ updatedAt: -1 })
        .populate("messages")
        .populate("sender")
        .populate("receiver");

      // console.log("currentUserCon", currentUserCon)

      const conversations = currentUserCon.map((con) => {
        const countUnseenMsg = con.messages?.filter(
          (msg) => msg.seen === false
        ).length;

        return {
          _id: con._id,
          sender: con.sender,
          receiver: con.receiver,
          unseenMsg: countUnseenMsg,
          lastMsg: con.messages?.length ? con.messages[0] : null,
          updatedAt: con.updatedAt,
        };
      });

      socket.emit("conversations", conversations);
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    if (user) {
      onlineUsers.delete(user?._id);
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
    console.log("user disconnected");
  });
});

export { app, server };
