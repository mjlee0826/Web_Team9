// src/services/todoService.js

// 使用記憶體陣列存儲，不連接 MongoDB
let todos = [
  { _id: '1', userId: 'mock_user_123', title: '修復登入頁面 bug', q: 'q1', date: '2026-03-18', tags: ['工程'], done: false },
  { _id: '2', userId: 'mock_user_123', title: '準備季度報告', q: 'q2', date: '2026-03-25', tags: ['管理'], done: false }
];

export const todoService = {
  // 取得該使用者的任務
  getAll: async (userId) => {
    return todos.filter(t => t.userId === userId);
  },

  // 建立任務
  create: async (userId, data) => {
    const newTodo = {
      _id: Math.random().toString(36).substr(2, 9), // 隨機生成 ID
      userId,
      title: data.title,
      q: data.q,
      date: data.date || '',
      tags: data.tags || [],
      done: false,
      createdAt: new Date()
    };
    todos.push(newTodo);
    return newTodo;
  },

  // 更新任務
  update: async (userId, id, data) => {
    const index = todos.findIndex(t => t._id === id && t.userId === userId);
    if (index === -1) return null;
    
    // 更新指定欄位
    todos[index] = { ...todos[index], ...data };
    return todos[index];
  },

  // 刪除任務
  delete: async (userId, id) => {
    const initialLength = todos.length;
    todos = todos.filter(t => !(t._id === id && t.userId === userId));
    return todos.length < initialLength;
  }
};