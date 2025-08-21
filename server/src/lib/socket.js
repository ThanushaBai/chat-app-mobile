import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log("User mapped:", userId, "->", socket.id);
    
    // Notify all clients about updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Online users:", Object.keys(userSocketMap));
  }

  // Typing indicators
  socket.on("typing:start", (data) => {
    const { receiverId } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing:start", {
        senderId: userId,
        senderName: data.senderName
      });
    }
  });

  socket.on("typing:stop", (data) => {
    const { receiverId } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing:stop", {
        senderId: userId
      });
    }
  });

  // Message read receipts
  socket.on("message:read", (data) => {
    const { senderId, messageId } = data;
    const senderSocketId = getReceiverSocketId(senderId);
    
    if (senderSocketId) {
      io.to(senderSocketId).emit("message:read", {
        messageId,
        readBy: userId
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    
    // Find and remove the user from the map
    for (const [id, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[id];
        console.log("User removed:", id);
        break;
      }
    }
    
    // Notify all clients about updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Online users after disconnect:", Object.keys(userSocketMap));
  });
});

export { io, app, server };