import { UserModel } from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    try {
        const cookie = req.cookies.jwt;
        if (!cookie) {
            return res.status(401).json({
                error: "Unauthorized | cookie not found",
                success: false
            });
        }

        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            const err = new Error("Unauthorized | invalid cookie token");
            err.status = 401;
            return next(err);
        }

        req.user = user;
        return next();
    } catch (error) {
        console.log("Error in authUser middleware:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}