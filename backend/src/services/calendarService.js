// backend/src/services/calendarService.js

/**
 * Temporary In-memory Database
 * Structure: 
 * { 
 * "userId": { 
 * "YYYY-MM-DD": [
 * { id: "string", title: "string", time: "string", type: "string" }
 * ] 
 * } 
 * }
 * Note: Data will be lost when the server restarts.
 */
const mockDatabase = {};

/**
 * Retrieve all events associated with a specific user.
 * If the user doesn't exist in the database yet, initialize an empty object for them.
 * * @param {string} userId - The unique identifier of the user (from JWT 'sub' claim).
 * @returns {Promise<Object>} A dictionary of events keyed by date strings.
 */
const getEventsByUser = async (userId) => {
    if (!mockDatabase[userId]) {
        // Initialize a new entry for first-time users
        mockDatabase[userId] = {}; 
    }
    return mockDatabase[userId];
};

/**
 * Add a new event to a specific date for a user.
 * * @param {string} userId - The unique identifier of the user.
 * @param {string} date - The date string (YYYY-MM-DD).
 * @param {Object} eventData - Object containing title, time, and type.
 * @returns {Promise<Object>} The newly created event object with a generated ID.
 */
const addEvent = async (userId, date, eventData) => {
    // Ensure the user and date arrays exist
    if (!mockDatabase[userId]) mockDatabase[userId] = {};
    if (!mockDatabase[userId][date]) mockDatabase[userId][date] = [];

    const newEvent = {
        // Use current timestamp as a simple unique ID for mock purposes
        id: Date.now().toString(), 
        ...eventData
    };

    mockDatabase[userId][date].push(newEvent);
    return newEvent;
};

/**
 * Delete a specific event from a user's calendar.
 * * @param {string} userId - The unique identifier of the user.
 * @param {string} date - The date string (YYYY-MM-DD).
 * @param {string} eventId - The ID of the event to be removed.
 * @returns {Promise<boolean>} True if an event was deleted, false otherwise.
 */
const deleteEvent = async (userId, date, eventId) => {
    // Check if the user and date exist before attempting deletion
    if (!mockDatabase[userId] || !mockDatabase[userId][date]) return false;

    const originalLength = mockDatabase[userId][date].length;
    
    // Filter out the event with the matching ID
    mockDatabase[userId][date] = mockDatabase[userId][date].filter(ev => ev.id !== eventId);
    
    // If the array length has decreased, the deletion was successful
    return mockDatabase[userId][date].length < originalLength;
};

export { getEventsByUser, addEvent, deleteEvent }