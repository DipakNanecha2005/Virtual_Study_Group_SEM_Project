import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.status(200).send("Home");
});

// error middleware
app.use((err, req, res, next) => {
    // console.log("error middleware:", err);
    return res.status(err.status || 500).json({ message: err.message, status: err.status || 500 });
});