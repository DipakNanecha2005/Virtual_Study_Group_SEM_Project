import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

// pre-defind middlewares
app.use(cors({
    origin: process.env.ORIGINS,
    // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
// const allowedOrigins = process.env.ORIGINS?.split(',') || [];
// app.use(cors({
//     origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// route import
import authRoute from "./routes/auth.route.js";
import contactRoute from "./routes/contact.route.js";
import messageRoute from "./routes/message.route.js";
import chatRoute from "./routes/chat.route.js";

// route middleware
app.use("/auth", authRoute);
app.use("/contact", contactRoute);
app.use("/message", messageRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
    res.status(200).send("Home");
});

// error middleware
app.use((err, req, res, next) => {
    // console.log("error middleware:", err);
    return res.status(err.status || 500).json({ error: err.message, status: err.status || 500, success: false });
});