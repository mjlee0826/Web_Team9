// Import the Express framework to create the server application
import express from 'express';
// Import the CORS middleware to handle Cross-Origin Resource Sharing
import cors from 'cors';
// Import the main router that contains all the defined endpoints
import router from './routes/index';

// Initialize the Express application instance
const app = express();

// --- 1. Global Middlewares ---

// Enable CORS (Cross-Origin Resource Sharing).
// This allows your frontend (e.g., Vite running on port 5173) to successfully 
// make API requests to this backend server (e.g., running on port 5000) without being blocked by the browser.
app.use(cors());

// Enable the built-in middleware to parse incoming HTTP requests that have a JSON payload.
// It takes the raw JSON string from the request body and converts it into a JavaScript object (accessible via req.body).
app.use(express.json()); 

// --- 2. Route Registration ---

// Mount the imported router at the root path ('/').
// All routes defined inside './routes/index' will be processed here.
app.use('/', router);

// Export the fully configured Express application so it can be imported and started in your main server file (e.g., server.js).
export default app;