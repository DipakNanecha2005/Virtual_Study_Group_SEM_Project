import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    content: {
        type: String
    },
    attachments: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

export const MessageModel = mongoose.model("Message", MessageSchema);