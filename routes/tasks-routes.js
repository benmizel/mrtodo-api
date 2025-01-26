import express from "express";
import * as taskController from "../controllers/task-controller.js";
const taskRouter = express.Router();

authRouter.route("/add").post(taskController.addTask);

authRouter.route("/update").post(taskController.updateTask);

authRouter.route("/delete").post(taskController.deleteTask);

authRouter.route("/").get(taskController.getTasks);

export default authRouter;