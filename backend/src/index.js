// src/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; // Needed for socket.io
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";

import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap express app
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Socket.io events
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  // Define socket events here
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});
