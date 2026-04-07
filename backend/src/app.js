/**
 * backend/src/app.js
 * * Main Application Configuration File.
 * This file is responsible for initializing the Express instance,
 * configuring global middlewares, and mounting the root router.
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
console.log("🔥 ENV:", process.env.LOGTO_ENDPOINT);

import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import todoRoutes from "./routes/todoRoutes.js";

// ✅ 先建立 app
const app = express();

// ==========================================
// 1. Global Middlewares
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// 2. Routes
// ==========================================

// ✅ 再掛 routes（順序很重要！）
app.use("/api/todos", todoRoutes);

app.use('/', router);
app.get("/", (req, res) => {
  res.send("OK");
});

// ==========================================
// 1. Global Middlewares Configuration
// ==========================================

/**
 * Enable Cross-Origin Resource Sharing (CORS).
 * This allows your frontend (typically running on port 5173 via Vite) 
 * to communicate with this backend server without being blocked by 
 * the browser's Same-Origin Policy.
 */
app.use(cors());

/**
 * Standard Body Parser Middleware.
 * This built-in Express middleware automatically parses incoming requests 
 * with JSON payloads, making the data accessible via 'req.body'.
 */
app.use(express.json()); 

// ==========================================
// 2. Routing Logic
// ==========================================

/**
 * Route Mounting.
 * We mount the main router at the root path ('/'). 
 * This main router usually acts as a gateway to all sub-routes 
 * (e.g., /api/calendar, /api/todo).
 */
app.use('/', router);

/**
 * Export the configured application instance.
 * By separating the app configuration from the server startup (server.js),
 * we make the code easier to test (e.g., using Supertest for unit testing).
 */
export default app;