// backend/src/routes/calendarRoutes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js'; // Authentication middleware
import { getEvents, createEvent, removeEvent } from '../controllers/calendarController.js';

/**
 * Calendar Router
 * Defines the mapping between HTTP methods/paths and their respective controller logic.
 * All routes here are protected by the 'requireAuth' middleware.
 */
const calendarRouter = express.Router();

/**
 * @route   GET /api/calendar/events
 * @desc    Fetch all calendar events associated with the authenticated user.
 * @access  Private (Requires valid JWT)
 */
calendarRouter.get('/events', requireAuth(), getEvents);

/**
 * @route   POST /api/calendar/events
 * @desc    Create a new calendar event (task, meeting, etc.) for the user.
 * @access  Private (Requires valid JWT)
 */
calendarRouter.post('/events', requireAuth(), createEvent);

/**
 * @route   DELETE /api/calendar/events/:date/:eventId
 * @desc    Remove a specific event using date and eventId path parameters.
 * @access  Private (Requires valid JWT)
 * @param   {string} date - The date key in YYYY-MM-DD format.
 * @param   {string} eventId - The unique ID of the event to be deleted.
 */
calendarRouter.delete('/events/:date/:eventId', requireAuth(), removeEvent);

export default calendarRouter;