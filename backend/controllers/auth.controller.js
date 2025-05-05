
import { UserModel } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, gender } = req.body;

        const userExists = await UserModel.findOne({ username });
        if (userExists) {
            return res.status(400).json({
                error: `${username} already exists`,
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyAvatar = UserModel.getBoyAvatar(username);
        const girlAvatar = UserModel.getGirlAvatar(username);

        const newUser = await UserModel.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            avatar: gender === "male" ? boyAvatar : girlAvatar
        });

        res.status(201).json({
            msg: "success", 
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                avatar: newUser.avatar,
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

        const token = generateTokenAndSetCookie(user._id, res);

        
        res.status(200).json({
            msg: "Login successfully",
            user,
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
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            msg: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log("Error in logout controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

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
            avatar: userData.avatar,
            email: userData?.email,
            bio: userData?.bio
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

export const completeProfileInfo = async (req, res) => {
    try {
        const { email, bio } = req.body;
        if(!email || ! bio) {
            return res.status(400).json({
                error: "Email and bio are required",
                success: false
            })
        }

        const userData = await UserModel.findByIdAndUpdate(
            req.userId,
            { email, bio, isProfileComplete: true },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            user: userData
            // user: {
            // _id: userData._id,
            // fullName: userData.fullName,
            // username: userData.username,
            // gender: userData.gender,
            // avatar: userData.avatar,
            // email: userData.email,
            // bio: userData.bio
            // }
        });
    } catch (error) {
        console.log("Error in completeProfileInfo controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}
