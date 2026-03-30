// Import StrictMode from React. 
// StrictMode is a tool for highlighting potential problems in an application. 
// It activates additional checks and warnings for its descendants (only in development mode).
import { StrictMode } from 'react'

// Import createRoot from React DOM.
// This is the modern React 18+ API used to create a root to display React components inside a browser DOM node.
import { createRoot } from 'react-dom/client'

// Import global CSS styles. These styles will be applied to the entire application.
import './index.css'

// Import the main App component, which serves as the root component of your application hierarchy.
import App from './App.jsx'

// Import BrowserRouter from React Router.
// It uses the HTML5 history API to keep your UI in sync with the current URL, enabling client-side routing.
import { BrowserRouter } from 'react-router-dom'

// Find the HTML element with the ID 'root' (usually located in your index.html file).
// Create a React root for it, and then render the component tree inside it.
createRoot(document.getElementById('root')).render(
  // Wrap the application in StrictMode to catch common bugs early during development.
  <StrictMode>
    {/* Wrap the App component in BrowserRouter to enable routing features throughout the entire application. */}
    <BrowserRouter>
      {/* The main application component where your routes (like /login, /todo) are defined. */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)