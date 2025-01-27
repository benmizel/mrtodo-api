import initKnex from "knex";
import configuration from "../knexfile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { blacklistRefreshToken, isTokenBlacklisted, generateToken } from "../utils/auth-utils.js";

const addTask = async (req, res) => {
    const { title, description, assigned_user_id, priority, status } = req.body;
  
    if (!title) {
      return res.status(400).send("Task title is required");
    }
  
    try {
      const [task] = await knex("tasks").insert({
        title,
        description,
        assigned_user_id,
        priority,
        status,
      }).returning("*");
  
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while adding the task");
    }
  };

  const updateTask = async (req, res) => {
    const { id, title, description, status, priority } = req.body;
  
    if (!id) {
      return res.status(400).send("Task ID is required");
    }
  
    try {
      const updatedTask = await knex("tasks")
        .where("id", id)
        .update({
          title,
          description,
          status,
          priority,
          updated_at: knex.fn.now(),
        })
        .returning("*");
  
      if (!updatedTask.length) {
        return res.status(404).send("Task not found");
      }
  
      res.json(updatedTask[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while updating the task");
    }
  };

  const deleteTask = async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).send("Task ID is required");
    }
  
    try {
      const deletedTask = await knex("tasks").where("id", id).del().returning("*");
  
      if (!deletedTask.length) {
        return res.status(404).send("Task not found");
      }
  
      res.status(200).send("Task deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while deleting the task");
    }
  };

  const getTasks = async (req, res) => {
    const { userId, status } = req.query; // Optional query parameters
  
    try {
      let query = knex("tasks").select("*");
  
      if (userId) {
        query = query.where("assigned_user_id", userId);
      }
  
      if (status) {
        query = query.where("status", status);
      }
  
      const tasks = await query;
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching tasks");
    }
  };

export { addTask, updateTask, deleteTask, getTasks };