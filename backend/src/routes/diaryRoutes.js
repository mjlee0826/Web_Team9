import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDiaries, createDiary } from '../controllers/diaryController.js';

const diaryRouter = Router();

diaryRouter.get('/entries', requireAuth(), getDiaries);
diaryRouter.post('/entries', requireAuth(), createDiary);

export default diaryRouter;