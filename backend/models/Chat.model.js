import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    groupChat: {
        type: Boolean,
        default: false
    },
    creator: { // admin
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });

export const ChatModel = mongoose.model("Chat", ChatSchema);