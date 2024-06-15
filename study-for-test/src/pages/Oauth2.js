import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Oauth() {
  const { setIsAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);

  useEffect(() => {
    const accessToken = queryParams.accessToken;

    if (accessToken) {
      const decodedAccessToken = JSON.parse(accessToken);
      localStorage.setItem('token', decodedAccessToken);
      setIsAuthenticated(true);
      // window.location.href = "https://study-for-test.onrender.com/dashboard"
       window.location.href = "http://localhost:3030/dashboard"
    }
  }, [location, navigate, setIsAuthenticated]);

  return <div></div>;
}
