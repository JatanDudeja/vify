import { Router } from "express";
import { getDirectChats } from "../controllers/chat.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/getDirectChats").post(verifyJWT, getDirectChats);
// router.route("/sendMessage/:username").post(verifyJWT, );

export default router;