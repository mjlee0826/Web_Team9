// src/services/todoService.js
import prisma from '../utils/prismaClient.js';

export const todoService = {
  // 取得該使用者的所有任務
  getAll: async (userId) => {
    // 從 Postgres 撈出該使用者的所有任務
    const todos = await prisma.todo.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' } // 依建立時間排序（新的在上面）
    });
    return todos;
  },

  // 建立新任務
  create: async (userId, data) => {
    const newTodo = await prisma.todo.create({
      data: {
        userId: userId,
        title: data.title,
        q: data.q || 'q1',
        // 如果前端傳來空字串，我們轉成 null 存入資料庫
        date: data.date || null, 
        tags: data.tags || [],
        done: false
      }
    });
    return newTodo;
  },

  // 更新任務 (例如：打勾完成、修改內容)
  update: async (userId, id, data) => {
    try {
      // 安全防護 1: 先確認這筆任務存在，而且是屬於這個 userId 的
      const existingTodo = await prisma.todo.findUnique({
        where: { id: id }
      });

      if (!existingTodo || existingTodo.userId !== userId) {
        return null; // 找不到或沒權限
      }

      // 執行更新
      const updatedTodo = await prisma.todo.update({
        where: { id: id },
        data: {
          title: data.title,
          q: data.q,
          date: data.date,
          tags: data.tags,
          done: data.done
        }
      });
      return updatedTodo;
    } catch (error) {
      console.error("Update todo error:", error);
      return null;
    }
  },

  // 刪除任務
  delete: async (userId, id) => {
    try {
      // 使用 deleteMany 來限制只能刪除「ID符合」且「屬於該使用者」的資料
      const result = await prisma.todo.deleteMany({
        where: {
          id: id,
          userId: userId // 安全機制：防止別人拿 ID 亂刪你的任務
        }
      });
      
      return result.count > 0; // count > 0 代表成功刪除
    } catch (error) {
      console.error("Delete todo error:", error);
      return false;
    }
  }
};