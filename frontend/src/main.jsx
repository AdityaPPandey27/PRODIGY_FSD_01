import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// We will create this context file in the next steps!
// It will manage our global authentication state.
import { AuthProvider } from './context/AuthContext.jsx'; 

// Import global CSS styles
import './index.css';

// Find the HTML element with id="root" and render our React app inside it
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode highlights potential problems in an application during development
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing (navigating without refreshing the page) */}
    <BrowserRouter>
      {/* AuthProvider wraps our app so EVERY component can access the user's login status */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);