import { Server } from "socket.io";

let ioInstance;
const userSocketMap = {}; // {userId: socketId}

export const initSockets = (server) => {
    const io = new Server(server, {
        cors: { origin: ["http://localhost:5173"], credentials: true },
    });
    ioInstance = io;

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) userSocketMap[userId] = socket.id;

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    return io;
};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// Emit to a specific socket
export function emitEvent(event, { receiverSocketId, message }) {
    if (ioInstance && receiverSocketId) {
        ioInstance.to(receiverSocketId).emit(event, message);
    }
}
