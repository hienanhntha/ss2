import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// const isTokenExpired = (accessToken) => {
//   if (!accessToken || typeof accessToken !== 'string' || accessToken === 'undefined') {
//     // No valid token to decode
//     return true;  // Assuming expired if no valid token
//   }

//   const decodedToken = jwtDecode(accessToken);
//   const currentDate = new Date();

//   // JWT exp is in seconds
//   return decodedToken.exp * 1000 < currentDate.getTime();
// };

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setToken]  = useState(localStorage.getItem('token'));
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Clearing token...");
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      window.location.reload();
    }, 3600000);
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      // No token, ensure user is logged out
      setIsAuthenticated(false);
    }
    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};