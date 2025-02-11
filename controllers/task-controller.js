import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const addTask = async (req, res) => {
  const { title, description, priority, status } = req.body;
  const assignedUserId = req.user.id;

  if (!title) {
    return res.status(400).send("Task title is required");
  }

  try {
    const result = await knex("tasks").insert({
      title,
      description,
      assigned_user_id: assignedUserId,
      priority,
      status,
    });

    const addedTask = result[0];

    const task = await knex("tasks")
      .where("id", addedTask)
      .andWhere("assigned_user_id", assignedUserId)
      .first();

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "An error occurred while adding the task");
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, priority } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await knex("tasks")
      .where("id", id)
      .andWhere("assigned_user_id", userId)
      .first();

    if (!task) {
      return res
        .status(404)
        .send("Task not found or you're unauthorized to update this task");
    }

    await knex("tasks").where("id", id).update({
      title,
      description,
      status,
      priority,
      updated_at: knex.fn.now(),
    });

    const updatedTask = await knex("tasks").where("id", id).first();
    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "An error occurred while updating the task");
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await knex("tasks")
      .where("id", id)
      .andWhere("assigned_user_id", userId)
      .first();

    if (!task) {
      return res
        .status(404)
        .send("Task not found or you're unauthorized to delete this task");
    }

    await knex("tasks").where("id", id).del();

    res.status(200).send("Task deleted successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "An error occurred while deleting the task");
  }
};

const getTasksByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await knex("tasks").where("assigned_user_id", userId);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "An error occurred while retrieving tasks");
  }
};

const getTaskByUserAndTaskId = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const task = await knex("tasks")
      .where("assigned_user_id", userId)
      .where("id", id);
    res.json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "An error occurred while retrieving tasks");
  }
};

export {
  addTask,
  updateTask,
  deleteTask,
  getTasksByUser,
  getTaskByUserAndTaskId,
};
