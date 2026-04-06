// frontend/src/services/calendarApi.js

/**
 * Base URL for calendar-related API endpoints.
 * Derived from the environment variable (e.g., http://localhost:3000/api/calendar).
 */
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/calendar`

/**
 * Fetch all calendar events for the authenticated user.
 * * @param {string} token - The Logto Access Token required for authorization.
 * @returns {Promise<Object>} A dictionary of events grouped by date strings.
 * @throws {Error} If the server returns a non-OK status.
 */
const fetchEvents = async (token) => {
    const res = await fetch(`${API_BASE_URL}/events`, {
        // Logto uses the Bearer authentication scheme
        headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
};

/**
 * Create a new event on the backend.
 * * @param {string} token - The Logto Access Token.
 * @param {string} date - The target date string (YYYY-MM-DD).
 * @param {Object} eventData - Contains title, time, and type.
 * @returns {Promise<Object>} The newly created event object with its database ID.
 */
const createEvent = async (token, date, eventData) => {
    const res = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        // Combine date and event data into a single payload
        body: JSON.stringify({ date, ...eventData })
    });
    
    if (!res.ok) throw new Error('Failed to create event');
    return res.json();
};

/**
 * Delete a specific event by its date and unique identifier.
 * * @param {string} token - The Logto Access Token.
 * @param {string} date - The date key where the event is stored.
 * @param {string} eventId - The unique ID of the event to remove.
 * @returns {Promise<void>} Resolves if deletion is successful.
 */
const deleteEvent = async (token, date, eventId) => {
    const res = await fetch(`${API_BASE_URL}/events/${date}/${eventId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    /**
     * Note: Success status 204 (No Content) results in res.ok being true.
     * We don't call res.json() here because the response body is empty.
     */
    if (!res.ok) throw new Error('Failed to delete event');
};

export { fetchEvents, createEvent, deleteEvent };