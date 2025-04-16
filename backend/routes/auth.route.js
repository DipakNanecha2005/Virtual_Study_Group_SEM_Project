import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authUser, logout);

export default router;