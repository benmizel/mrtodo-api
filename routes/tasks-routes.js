import express from "express";
import * as tasksController from "../controllers/tasks-controller.js";
const tasksRouter = express.Router();
tasksRouter
  .route("/")
  .get(tasksRouter.getAllTasks)
  .post(tasksRouter.createTask)
tasksRouter
  .route("/:id")
  .put(tasksRouter.updateTask)
  .delete(tasksRouter.deleteTask);

export default tasksRouter;
