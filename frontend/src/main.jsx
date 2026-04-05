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

// Import LogtoProvider from the Logto React SDK.
// This provider creates a global authentication context, allowing any component inside it 
// to access login state, user information, and authentication methods.
import { LogtoProvider } from '@logto/react';

// Import BrowserRouter from React Router.
// It uses the HTML5 history API to keep your UI in sync with the current URL, enabling client-side routing.
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext.jsx';

// Configuration object for the Logto integration.
// It securely loads the required endpoint and application ID from your local .env file
// using Vite's specific environment variable syntax (import.meta.env).
const config = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT, // Corrected from VITE_LOGOTO_ENDPOINT
  appId: import.meta.env.VITE_LOGTO_APPID,
  resources: [
    import.meta.env.VITE_LOGTO_API_RESOURCE // 換成你設定的 API Identifier
  ],
};

// Find the HTML element with the ID 'root' (usually located in your index.html file).
// Create a React root for it, and then render the component tree inside it.
createRoot(document.getElementById('root')).render(
  // Wrap the application in StrictMode to catch common bugs early during development.
  <StrictMode>
    {/* Wrap the application in LogtoProvider, passing the configuration object. 
        Placing it outside the BrowserRouter ensures that routing decisions can 
        reliably depend on the authentication state right from the start. 
    */}
    <LogtoProvider config={config}>
      <AuthProvider>
        {/* Wrap the App component in BrowserRouter to enable routing features throughout the entire application. */}
        <BrowserRouter>
          {/* The main application component where your routes (like /login, /todo) are defined. */}
          <App />
        </BrowserRouter>
      </AuthProvider>
    </LogtoProvider>
  </StrictMode>,
)