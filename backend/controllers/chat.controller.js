import { ChatModel } from "../models/Chat.model.js";
import { MessageModel } from "../models/Message.model.js";

export const newChat = async (req, res) => {
    try {
        const { isGroup } = req.body;

        // handle one to one chat
        if (!isGroup) {
            const { self, otherUser } = req.body;
            if (!self || !otherUser) {
                return res.status(400).json({
                    error: "self and otherUser are required",
                    success: false
                });
            }

            const chatExists = await ChatModel.findOne({
                isGroup: false,
                members: { $all: [self, otherUser] }
            });
            if (chatExists) {
                return res.status(200).json({
                    success: true,
                    chat: chatExists
                });
            }

            const createdChat = await ChatModel.create({
                isGroup,
                members: [self, otherUser]
            });
            return res.status(201).json({
                success: true,
                chat: createdChat
            });
        }

        // handle group chta
        const { name, creator, members } = req.body
        if (!name || !creator || !members) {
            return res.status(400).json({
                error: "Group chat name, creator, members are required",
                success: false
            });
        }

        const groupChatExists = await ChatModel.findOne({ name });
        if (groupChatExists) {
            return res.status(400).json({
                error: `${name} group chat already exists`,
                success: false
            });
        }

        const groupChat = await ChatModel.create({
            name,
            isGroup,
            creator,
            members
        });
        return res.status(201).json({
            success: true,
            chat: groupChat
        });
    } catch (error) {
        console.log("Error in newChat controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

// export const getAllChatByUser = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         if (!userId) {
//             return res.status(400).json({
//                 error: "userId is required",
//                 success: false
//             });
//         }

//         const chats = await ChatModel.find({ members: userId })
//             .populate("members");
//         if (!chats) {
//             return res.status(404).json({
//                 error: "chats not found",
//                 success: false
//             });
//         }

        
//         res.status(200).json({
//             chats,
//             success: true,
//         });
        
//     } catch (error) {
//         console.log("Error in getAllChatByUser controller:", error);
//         res.status(500).json({
//             error: "Internal server error",
//             success: false
//         });
//     }
//}

export const getAllChatByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                error: "userId is required",
                success: false
            });
        }

        // Fetch all chats for the user
        const chats = await ChatModel.find({ members: userId })
            .populate("members")
            .sort({ updatedAt: -1 });  // Sort chats by latest update time, optional

        if (!chats || chats.length === 0) {
            return res.status(404).json({
                error: "Chats not found",
                success: false
            });
        }

        const chatsWithLatestMessage = await Promise.all(chats.map(async (chat) => {
            // Fetch the latest message for the particular chatId
            const latestMessage = await MessageModel.findOne({ chatId: chat._id })
              .sort({ sendAt: -1 })  // Sort by sendAt to get the latest message
              .limit(1);  // Get only the latest message (limit to 1)
          
            // Return the chat object with the latest message added
            return {
              ...chat.toObject(), // Convert the Mongoose chat document to plain JS object
              latestMessage: latestMessage || null,  // Add latest message or null if no messages exist
            };
          }));
          

        res.status(200).json({
            chats: chatsWithLatestMessage,
            success: true
        });
    } catch (error) {
        console.log("Error in getAllChatByUser controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

export const getOneChatByID = async (req, res) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({
                error: "userId is required",
                success: false
            });
        }

        const chat = await ChatModel.findById(chatId)
            .populate("members");
        if (!chat) {
            return res.status(404).json({
                error: "Chat not found",
                success: false
            });
        }

        res.status(200).json({
            chat,
            success: true
        });
    } catch (error) {
        console.log("Error in getOneChatByID controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}