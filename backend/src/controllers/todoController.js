// src/controllers/todoController.js
import { todoService } from '../services/todoService.js';

export const todoController = {
  getTodos: async (req, res) => {
    try {
      const userId = req.user.id; // 對齊 calendarController 使用 .id
      const data = await todoService.getAll(userId);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createTodo: async (req, res) => {
    try {
      const userId = req.user.id;
      const newTodo = await todoService.create(userId, req.body);
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  updateTodo: async (req, res) => {
    try {
      const userId = req.user.id;
      const updated = await todoService.update(userId, req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Task not found' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const userId = req.user.id;
      const success = await todoService.delete(userId, req.params.id);
      if (success) {
        // 204 No Content: 對齊 calendar 成功刪除不回傳 Body 的做法
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};