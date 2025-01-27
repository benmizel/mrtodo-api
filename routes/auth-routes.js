import express from "express";
import * as authController from "../controllers/auth-controller.js";
const authRouter = express.Router();

authRouter.route("/signup").post(authController.signUp);

authRouter.route("/login").post(authController.login);

authRouter.route("/refresh-token").post(authController.refreshToken);

authRouter.route("/logout").post(authController.logout);

export default authRouter;
