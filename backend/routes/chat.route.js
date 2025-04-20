import express from "express";
import { newChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", newChat);

export default router;