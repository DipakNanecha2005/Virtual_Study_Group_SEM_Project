import { Server as SocketIOServer } from "socket.io"
import { MessageModel } from "./models/Message.model.js";
import { ChatModel } from "./models/Chat.model.js";

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

    // const sendMessage = async (message) => {
    //     console.log("Message Recive to server ::",message);

    //     const senderSocketId = userSocketMap.get(message?.sender);
    //     const chatId = userSocketMap.get(message?.chatId);

    //     const createdMessage = await MessageModel.create(message);
    //     console.log("Created Nessages ::",createdMessage);

    //     const messageData = await MessageModel.findById(createdMessage._id)
    //         .populate("sender", "id fullName username avatar")
    //         .populate("chatId", "id fullName username avatar");

    //     if(chatId) {
    //         io.to(chatId).emit("recieveMessage", messageData);
    //     }
    //     if(senderSocketId) {
    //         io.to(senderSocketId).emit("recieveMessage", messageData);
    //     }
    // }

    const newMessage = async (messageData) => {
        try {
            const { sender, messageType, content, fileUrl, chatId } = req.body;
            if (!sender || !messageType || !chatId) {
                return socket.emit("error", "Sender, messageType, and chatId are required");
            }

            let createdMessage;
            if (messageType === "text") {
                if (!content) {
                    return socket.emit("error", "Content is required for text messages");
                }

                createdMessage = await MessageModel.create({ sender, messageType, content, chatId });
            } else if (messageType === "file") {
                if (!fileUrl) {
                    return socket.emit("error", "File URL is required for file messages");
                }
                createdMessage = await MessageModel.create({ sender, messageType, fileUrl, chatId });
            }

            const chat = await ChatModel.findById(chatId).populate("members");
            chat.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receiveMessage", createdMessage);
                }
            });
        } catch (error) {
            console.log("Error in newMessage function socket.js file:", error);
            socket.emit("error", "Error handling newMessage");
        }
    }

    const messageTypeing = async (data) => {
        socket.broadcast.to(data.chatId).emit("userTyping", data);
    }

    const userTyping = (data) => {
        socket.broadcast.to(data.chatId).emit("userTyping", data);
    }

    const createChat = async (chatData) => {
        try {
            const { creator, members, isGroup, name } = req.body;
            if (!creator || !members || !isGroup) {
                return socket.emit("error", "Creator, members, and group status are required");
            }

            const newChat = await ChatModel.create({
                creator,
                members,
                isGroup,
                name
            });

            members.forEach((memberId) => {
                const memberSocketId = userSocketMap.get(memberId.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("chatCreated", newChat);
                }
            });
        } catch (error) {
            console.log("Error in createChat function socket.js file:", error);
            socket.emit("error", "Error creating chat");
        }
    }

    const addUserToChat = async (data) => {
        try {
            const { chatId, userId } = req.body;

            const chat = await ChatModel.findById(chatId);
            if (!chat) {
                return socket.emit("error", "Chat not found");
            }

            chat.members.push(userId);
            await chat.save();

            chat.members.forEach((memberId) => {
                const memberSocketId = userSocketMap.get(memberId.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("userAddedToChat", { chatId, userId });
                }
            })
        } catch (error) {
            console.log("Error in addUserToChat function socket.js file:", error);
            socket.emit("error", "Error adding user to chat");
        }
    }

    const removeUserFromChat = async (data) => {
        try {
            const { chatId, userId } = data;

            const chat = await ChatModel.findById(chatId);
            if (!chat) {
                return socket.emit("error", "Chat not found");
            }
            chat.members = chat.members.filter((member) => member.toString() !== userId);
            await chat.save();

            chat.members.forEach((memberId) => {
                const memberSocketId = userSocketMap.get(memberId.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("userRemovedFromChat", { chatId, userId });
                }
            });
        } catch (error) {
            console.log("Error in removeUserFromChat function socket.js file:", error);
            socket.emit("error", "Error removing user from chat");
        }
    }

    const chatUpdated = async (updatedChat) => {
        try {
            const { chatId, newName } = updatedChat;
            
            const chat = await ChatModel.findByIdAndUpdate(chatId, { name: newName }, { new: true });
            if (!chat) {
                return socket.emit("error", "Chat not found");
            }

            chat.members.forEach((memberId) => {
                const memberSocketId = userSocketMap.get(memberId.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("chatUpdated", chat);
                }
            });
        } catch (error) {
            console.log("Error in chatUpdated function socket.js file:", error);
            socket.emit("error", "Error updating chat");
        }
    }

    const userOnline = (userId) => {
        io.emit("userOnline", userId);
    }

    const userOffline = (userId) => {
        io.emit("userOffline", userId);
    }

    const fileUpload = async (fileData) => {
        try {
            const { sender, fileUrl, chatId } = fileData;
            if (!sender || !fileUrl || !chatId) {
                return socket.emit("error", "Sender, fileUrl, and chatId are required");
            }

            const newMessage = await MessageModel.create({ 
                sender, messageType: "file", 
                fileUrl, 
                chatId 
            });

            const chat = await ChatModel.findById(chatId)
                .populate("members");
            chat.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if(memberSocketId) {
                    io.to(memberSocketId).emit("fileReceived", newMessage);
                }
            });

        } catch (error) {
            console.log("Error in fileUpload function socket.js file:", error);
            socket.emit("error", "Error uploading file");
        }
    }

    const deleteMessage = async (messageId, chatId) => {
        try {
            const message = await MessageModel.findByIdAndDelete(messageId);
            if(!message) {
                return socket.emit("error", "Message not found");
            }

            const chat = await ChatModel.findById(chatId)
                .populate("members");
            chat.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("messageDeleted", { messageId, chatId });
                }
            });
            
        } catch (error) {
            console.log("Error in deleteMessage function socket.js file:", error);
            socket.emit("error", "Error deleting message");
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

        socket.on("newMessage", newMessage);
        // io.to(memberSocketId).emit("receiveMessage", createdMessage); 
        socket.on("messageTypeing", messageTypeing);
        socket.on("userTyping", userTyping);
        socket.on("createChat", createChat);
        socket.on("addUserToChat", addUserToChat);
        socket.on("removeUserFromChat", removeUserFromChat);
        socket.on("chatUpdated", chatUpdated);
        socket.on("userOnline", userOnline);
        socket.on("userOffline", userOffline);
        socket.on("fileUpload", fileUpload);
        socket.on("deleteMessage", deleteMessage);

        /* testing */
        // socket.on("sendMessage", sendMessage);
        // socket.on('join_room');
        socket.on("disconnect", () => disconnect(socket));
    });
}