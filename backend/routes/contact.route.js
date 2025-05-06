import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { getAllContacts, searchContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/search", authUser, searchContacts);
router.get("/get-all-contacts", authUser, getAllContacts);

export default router;