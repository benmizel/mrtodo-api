import express from "express";
import * as authController from "../controllers/auth-controller.js";
const authRouter = express.Router();
inventoriesRouter.route("/signup").post(authController.signUp);
inventoriesRouter.route("/login").post(authController.login);
inventoriesRouter.route("/:id").delete(authController.deleteUser);

export default authRouter;
