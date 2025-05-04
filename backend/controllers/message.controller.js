import { MessageModel } from "../models/Message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryHelper.js";

export const newMessage = async (req, res) => {
    try {
        const { sender, messageType, chatId } = req.body;
        if (!sender || !messageType || !chatId) {
            return res.status(400).json({
                error: "Sender, messageType, and chatId are required",
                success: false
            });
        }

        if (messageType === "text") {
            const { content } = req.body;
            if (!content) {
                return res.status(400).json({
                    error: "Content is required for text messages",
                    success: false
                });
            }

            const message = await MessageModel.create({ sender, messageType, content, chatId });
            return res.status(201).json({
                message,
                success: true
            });
        }

        if (messageType === "file") {
            if (!req.file || !req.file.fileUrl) {
                return res.status(400).json({
                    error: "File is required",
                    success: false
                });
            }

            const { fileUrl } = req.file;
            const message = await MessageModel.create({ sender, messageType, fileUrl, chatId });
            return res.status(201).json({
                message,
                success: true
            });
        }

        return res.status(400).json({
            error: "Invalid message type",
            success: false
        });
    } catch (error) {
        console.log("Error in newMessage controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({
                error: "chatId is required to get messages",
                success: false
            });
        }

        const messages = await MessageModel.find({ chatId })
            .populate("sender");
        res.sattus(200).json({
            messages,
            success: true
        });
    } catch (error) {
        console.log("Error in getMessages controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File required");
        }

        console.log({ file: req.file });
        const result = await uploadOnCloudinary(req.file.path);
        res.status(200).json({ response: result });
    } catch (error) {
        console.log({ error });
    }
}

