// src/routes/todoRoutes.js
import express from 'express';
import { todoController } from '../controllers/todoController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth(), todoController.getTodos);
router.post('/', requireAuth(), todoController.createTodo);
router.patch('/:id', requireAuth(), todoController.updateTodo);
router.delete('/:id', requireAuth(), todoController.deleteTodo);

export default router;