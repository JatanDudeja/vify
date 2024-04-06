import { Router } from "express";
import { addContact, getLoggedInUser, logoutUser, userLogin, userSignup } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(userSignup)
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/getLoggedInUser").post(verifyJWT, getLoggedInUser);
router.route("/addContact").post(verifyJWT, addContact);

export default router;
