import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { userRouter } from "./routes/index.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/index.js";

dotenv.config().parsed;
// const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// api endpoint
app.use("/api", userRouter);

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
