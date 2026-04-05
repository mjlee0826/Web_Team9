// Load environment variables from the .env file into process.env.
// This allows you to securely access configurations (like PORT or database passwords) without hardcoding them.
require('dotenv').config();

// Import the configured Express application instance from app.js.
import app from './app';

// Define the port number the server will run on.
// It checks process.env.PORT first; if it is undefined (e.g., .env is missing), it defaults to 4000.
const PORT = process.env.PORT || 4000;

// Start the server and listen for incoming HTTP requests on the defined port.
app.listen(PORT, () => {
    // Log a success message to the console once the server is actively running.
    console.log(`🚀 伺服器已成功啟動於 http://localhost:${PORT}`);
});