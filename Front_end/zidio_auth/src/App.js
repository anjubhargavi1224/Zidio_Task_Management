import React from "react"; 
import AuthForm from "./components/AuthForm"; // Importing the AuthForm component
import "./App.css"; // Importing global styles

// Root component of the application
function App() {
  return (
    <div className="app-container">
      {/* Rendering the AuthForm component inside the main container */}
      <AuthForm />
    </div>
  );
}

export default App; // Exporting the App component as the default export
