import { Server } from "socket.io";

let ioInstance;
const userSocketMap = {}; // { userId: socketId }

// Initialize Socket.io
export const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", process.env.CLIENT_URL],
      credentials: true,
    },
  });
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // Send all online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

// Get a specific user's socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Emit an event to a specific socket
export function emitEvent(event, { receiverSocketId, message }) {
  if (ioInstance && receiverSocketId) {
    ioInstance.to(receiverSocketId).emit(event, message);
  }
}
