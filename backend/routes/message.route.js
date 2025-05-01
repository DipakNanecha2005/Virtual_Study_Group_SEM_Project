import express from "express";
import { messageTypeVerifyMiddleware } from "../middlewares/messageType.middleware.js";
import { getMessages, newMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", messageTypeVerifyMiddleware, newMessage);
// router.post('/upload', upload.single('fileUrl'), <CONTROLLER>);

router.get("/:chatId", getMessages);



export default router;