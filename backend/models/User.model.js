import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// bio
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required."]
    },
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        // required: [true, "Email is required."],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        select: false
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Gender is required."],
    },
    avatar: {
        type: String,
        default: ""
    },
    refreshToken: String
}, { timestamps: true });

// UserSchema.pre("save", function () {
//     if (isModified("password")) {

//     }
// });

UserSchema.statics.getBoyAvatar = (username) => `https://avatar.iran.liara.run/public/boy?username=${username}`;
UserSchema.statics.getGirlAvatar = (username) => `https://avatar.iran.liara.run/public/girl?username=${username}`;

export const UserModel = mongoose.model("User", UserSchema);