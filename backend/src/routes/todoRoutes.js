// src/routes/todoRoutes.js
import { Router } from 'express';
import { todoController } from '../controllers/todoController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// 確保所有路徑都受到 Logto 驗證保護
router.use(requireAuth);

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.patch('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;