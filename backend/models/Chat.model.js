import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.isGroup;
        }
    },
    isGroup: {
        type: Boolean,
        default: false // default one-to-one chat
    },
    creator: { // admin
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
            return this.isGroup;
        }
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });

export const ChatModel = mongoose.model("Chat", ChatSchema);