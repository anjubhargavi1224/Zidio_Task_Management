import { useState, useEffect, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure you have installed jwt-decode

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Only "admin" or "user"

  // Decode token and set user details
  const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setRole(decoded.role); // Ensure role is always "admin" or "user"
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      setUser(null);
      setRole(null);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!user;

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    decodeToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
