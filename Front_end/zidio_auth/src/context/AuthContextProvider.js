import React, { createContext, useState } from "react";

// Create Auth Context
export const AuthContext = createContext();

// Auth Context Provider Component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
