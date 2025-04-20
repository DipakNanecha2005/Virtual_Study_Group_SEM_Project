import { Server as SocketIOServer } from "socket.io"
import { MessageModel } from "./models/Message.model.js";

export const setupSocket = (server) => {
    const io = new SocketIOServer(
        server, {
        cors: {
            origin: process.env.ORIGINS,
            // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        console.log("Message Recive to server ::",message);
        
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message?.recipient);

        const createdMessage = await (await MessageModel.create(message)).save();
        console.log("Created Nessages ::",createdMessage);
        
        const messageData = await MessageModel.findById(createdMessage._id)
            .populate("sender", "id fullName username avatar")
            .populate("recipient", "id fullName username avatar");

        if(recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if(senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket id: ${socket.id}`);
        } else {
            console.log("User id not provided during connection");
        }

        socket.on("sendMessage", sendMessage);
        // socket.on('join_room');
        socket.on("disconnect", () => disconnect(socket));
    });
}