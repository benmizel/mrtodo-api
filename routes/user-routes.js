import express from "express";
import * as userController from "../controllers/user-controller.js";
import { authenticateJWT } from "../middleware/auth-middleware.js";

const userRouter = express.Router();
userRouter.route("/").delete(authenticateJWT, userController.deleteUser);


export default userRouter;
