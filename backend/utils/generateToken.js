import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "5d"
    });

    res.cookie("jwt", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5d in ms
        httpOnly: true, // prevent XSS attack (cross-site scripting attacks)
        sameSite: "strict", // prevent CSRF attack (cross-site request forgery attacks)
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}