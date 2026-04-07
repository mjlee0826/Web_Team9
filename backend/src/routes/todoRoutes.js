// src/routes/todoRoutes.js
import { Router } from 'express';
import { todoController } from '../controllers/todoController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// 應用中間件：所有 Todo 操作皆須登入
router.use(requireAuth);

// 定義 RESTful 路徑
router.get('/', todoController.getTodos);           // GET /api/todos
router.post('/', todoController.createTodo);        // POST /api/todos
router.patch('/:id', todoController.updateTodo);    // PATCH /api/todos/:id
router.delete('/:id', todoController.deleteTodo);   // DELETE /api/todos/:id

export default router;