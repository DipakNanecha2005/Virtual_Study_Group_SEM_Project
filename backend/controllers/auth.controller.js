import { UserModel } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { token } from "morgan";

export const signup = async (req, res) => {
    console.log("Welcome to backend Signup URL ");
    try {
        const { fullName, username, password, gender } = req.body;
        console.log(req.body);

        const userExists = await UserModel.findOne({ username });
        if (userExists) {
            return res.status(400).json({
                error: `${username} already exists`,
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword)

        const boyAvatar = UserModel.getBoyAvatar(username);
        const girlAvatar = UserModel.getGirlAvatar(username);

        const newUser = await UserModel.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            avatar: gender === "male" ? boyAvatar : girlAvatar
        });
        console.log("This is the new user")
        console.log(newUser);
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            msg: "success", user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                avatar: newUser.avatar
            },
            success: true
        });
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        if (req.cookies.jwt) {
            return res.status(400).json({
                error: "Already logeed in / cookie stored",
                success: false
            });
        }


        const { username, password } = req.body;
        const user = await UserModel.findOne({ username }).select("+password");
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(404).json({
                error: "Invalid cridentials",
                success: false
            });
        }

        generateTokenAndSetCookie(user._id, res);


        res.status(200).json({
            msg: "Login successfully",
            token,
            success: true
        });
    } catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) }); // Clear cookie
        res.status(200).json({
            success: true,
            msg: "Logged out successfully"
        });
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const userData = await UserModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({
                error: "User with given id not found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            // user: {
            _id: userData._id,
            fullName: userData.fullName,
            username: userData.username,
            gender: userData.gender,
            avatar: userData.avatar
            // }
        });
    } catch (error) {
        console.log("Error in getUserInfo controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

