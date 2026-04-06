// backend/src/controllers/calendarController.js
import * as calendarService from '../services/calendarService.js';

/**
 * Retrieve all calendar events for the authenticated user.
 * @route GET /api/calendar/events
 */
const getEvents = async (req, res) => {
    try {
        // userId is extracted from the JWT payload by the auth middleware
        const userId = req.user.id; 
        const events = await calendarService.getEventsByUser(userId);
        
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new event for the authenticated user.
 * @route POST /api/calendar/events
 * @body {string} date - Format: YYYY-MM-DD
 * @body {string} title - The name of the task
 * @body {string} time - Optional time string
 * @body {string} type - Event category (e.g., task, meeting)
 */
const createEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, title, time, type } = req.body;

        // Basic validation: ensure required fields are present
        if (!date || !title) {
            return res.status(400).json({ error: 'Date and Title are required' });
        }

        const newEvent = await calendarService.addEvent(userId, date, { title, time, type });
        
        // 201 Created: indicates successful resource creation
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete a specific event for the authenticated user.
 * @route DELETE /api/calendar/events/:date/:eventId
 */
const removeEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        // Extracting parameters from the URL path: /api/calendar/events/:date/:eventId
        const { date, eventId } = req.params;

        const success = await calendarService.deleteEvent(userId, date, eventId);
        
        if (success) {
            // 204 No Content: Request succeeded but there is no content to send back
            res.status(204).send(); 
        } else {
            // 404 Not Found: The resource could not be found in the mock database
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getEvents, createEvent, removeEvent }