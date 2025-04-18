import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { searchContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/search", authUser, searchContacts);

export default router;