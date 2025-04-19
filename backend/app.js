import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// route import
import authRoute from './routes/auth.route.js';

// route middleware
app.use("/auth", authRoute);

app.get("/", (req, res) => {
    res.status(200).send("Home");
});

// error middleware
app.use((err, req, res, next) => {
    // console.log("error middleware:", err);
    return res.status(err.status || 500).json({ error: err.message, status: err.status || 500, success: false });
});