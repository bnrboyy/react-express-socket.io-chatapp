import express from "express";
import { Server } from "socket.io";
import http from "http";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import User from "../models/UserModel.js";

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
    socket.join(user?._id);
    onlineUsers.add(user?._id?.toString());

    io.emit("onlineUsers", Array.from(onlineUsers));

    socket.on("message-page", async (userId) => {
      const user = await User.findById(userId).select("-password");

      const payload = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        profile_pic: user?.profile_pic,
        online: onlineUsers.has(user?._id?.toString()),
      };

      socket.emit("message-user", payload);
    });
  }

  socket.on("disconnect", () => {
    if (user) {
      onlineUsers.delete(user?._id);
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
    console.log("user disconnected");
  });
});

export { app, server };
