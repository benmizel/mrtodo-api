import express from "express";
import * as taskController from "../controllers/task-controller.js";
import { authenticateJWT } from "../middleware/auth-middleware.js";
const taskRouter = express.Router();

taskRouter.use(authenticateJWT);

taskRouter.route("/add").post(taskController.addTask);

taskRouter.route("/update").post(taskController.updateTask);

taskRouter.route("/delete").post(taskController.deleteTask);

taskRouter.route("/").get(taskController.getTasks);

export default authRouter;