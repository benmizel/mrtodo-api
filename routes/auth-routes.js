import express from "express";
import * as authController from "../controllers/auth-controller.js";
import {
  loginLimiter,
  refreshTokenLimiter,
} from "../utils/rateLimiter-utils.js";

const authRouter = express.Router();

authRouter.route("/signup").post(authController.signUp);

authRouter.route("/login").post(loginLimiter, authController.login);

authRouter
  .route("/refresh-token")
  .post(refreshTokenLimiter, authController.refreshToken);

export default authRouter;
