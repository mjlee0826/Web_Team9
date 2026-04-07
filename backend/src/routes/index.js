// Import individual feature routers.
// These files contain the specific endpoints (GET, POST, etc.) for each feature.
import calendarRouter from "./calendarRoutes.js";
import diaryRouter from "./diaryRoutes.js";
import habitRouter from "./habitRoutes.js";
// import todoRouter from "./todoRoutes.js";

// Import the Router factory function from the Express framework.
import { Router } from "express";

// Initialize a new main Express Router instance.
// This acts as a central hub to group all your sub-routers together.
const router = Router();

// Mount the feature-specific routers to their respective base API paths.
// For example, any request starting with '/api/calendar' (like GET /api/calendar/events)
// will be handed off to the calendarRouter to process.
router.use('/api/calendar', calendarRouter);
router.use('/api/diary', diaryRouter);
router.use('/api/habit', habitRouter);
// router.use('/api/todo', todoRouter);

// Export this main router so it can be imported and mounted in your main app.js file 
// (e.g., app.use('/', router);).
export default router;