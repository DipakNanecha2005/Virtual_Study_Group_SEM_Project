import express from "express";
import { getAllChatByUser, newChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", newChat);
router.get("/:userId", getAllChatByUser);
router.get("/:chatId", getAllChatByUser);

export default router;