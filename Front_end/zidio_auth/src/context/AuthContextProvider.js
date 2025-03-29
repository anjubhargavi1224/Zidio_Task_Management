import React, { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // To decode JWT
// Create Auth Context
export const AuthContext = createContext();

// Auth Context Provider Component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") );
 
 
  useEffect(() => {
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          setUser(decodedUser);
        } catch (error) {
          console.error("Invalid token:", error);
          setUser(null);
          localStorage.removeItem("token"); // Remove invalid token
        }
      }
    }, [token]);
// console.log(token);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
