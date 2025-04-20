import express from "express";
import { getUserInfo, login, logout, signup } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/authMiddlerware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.use(authUser);
router.get('/check-auth',authUser,(req,res) => {
    res.status(200).json({success:true});
});
router.post("/logout", logout);
router.get("/user-info", getUserInfo);

export default router;