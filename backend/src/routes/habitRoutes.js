import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getHabits, createHabit, updateHabitController, removeHabitController } from '../controllers/habitController.js';

const habitRouter = Router();

// 取得所有習慣
habitRouter.get('/entries', requireAuth(), getHabits);

// 新增習慣
habitRouter.post('/entries', requireAuth(), createHabit);

// 更新習慣
habitRouter.put('/entries/:id', requireAuth(), updateHabitController);

// 刪除習慣
habitRouter.delete('/entries/:id', requireAuth(), removeHabitController);

export default habitRouter;