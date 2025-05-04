import express from "express";
import { messageTypeVerifyMiddleware } from "../middlewares/messageType.middleware.js";
import { getMessages, newMessage, uploadFile } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/", messageTypeVerifyMiddleware, newMessage);
// router.post('/upload', upload.single('fileUrl'), <CONTROLLER>);
router.post("/uploadFile", upload.single("file"), uploadFile);

router.get("/:chatId", getMessages);



export default router;