import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messsageType: {
      type: String,
      enum: ["text", "file"],
      default: "text"  
    },
    content: {
        type: String,
        required: function () {
            return this.messsageType === "text";
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messsageType === "file";
        }
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sendAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const MessageModel = mongoose.model("Message", MessageSchema);