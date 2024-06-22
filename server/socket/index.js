import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

/** socket  */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("conection", (socket) => {
  console.log("user connected", socket.id);

  io.on("disconect", (socket) => {
    console.log("user disconnected");
  });
});

export { app, server };
