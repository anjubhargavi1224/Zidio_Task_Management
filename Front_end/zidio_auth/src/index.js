// Importing necessary modules from React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importing ReactDOM for rendering the React component tree
import './index.css'; // Importing global CSS styles
import App from './App'; // Importing the main App component
import reportWebVitals from './reportWebVitals'; // Importing performance measurement function

// Creating a root element to render the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Rendering the App component inside StrictMode for highlighting potential issues */}
    <App />
  </React.StrictMode>
);

// Performance Monitoring (Optional)
// reportWebVitals helps measure app performance by logging results 
// or sending them to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
