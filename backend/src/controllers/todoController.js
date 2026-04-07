// src/controllers/todoController.js
import { todoService } from '../services/todoService.js';

export const todoController = {
  getTodos: async (req, res) => {
    try {
      const userId = req.user.sub; // 來自驗證中間件
      const data = await todoService.getAll(userId);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: '讀取失敗' });
    }
  },

  createTodo: async (req, res) => {
    try {
      const userId = req.user.sub;
      const newTodo = await todoService.create(userId, req.body);
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(400).json({ error: '新增失敗' });
    }
  },

  updateTodo: async (req, res) => {
    try {
      const userId = req.user.sub;
      const updated = await todoService.update(userId, req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: '找不到該任務' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: '更新失敗' });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const userId = req.user.sub;
      const success = await todoService.delete(userId, req.params.id);
      if (!success) return res.status(404).json({ error: '找不到該任務' });
      res.status(200).json({ message: '刪除成功' });
    } catch (err) {
      res.status(500).json({ error: '刪除失敗' });
    }
  }
};