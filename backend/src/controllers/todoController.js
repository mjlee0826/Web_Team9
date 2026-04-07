// todoController.js

import {
  getTodosByUser,
  createTodo,
  toggleTodo,   
  deleteTodo,
} from "../services/todoService.js";

export const getTodos = (req, res) => {
  const userId = req.user?.sub;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const todos = getTodosByUser(userId);
  res.json(todos);
};

export const addTodo = (req, res) => {
  const userId = req.user?.sub;
  const { text } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const todo = createTodo(userId, text);
  res.status(201).json(todo);
};

export const toggle = (req, res) => {
  const userId = req.user?.sub;
  const id = Number(req.params.id);

  const updated = toggleTodo(id, userId);

  if (!updated) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(updated);
};

export const remove = (req, res) => {
  const userId = req.user?.sub;
  const id = Number(req.params.id);

  const success = deleteTodo(id, userId);

  if (!success) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json({ success: true });
};