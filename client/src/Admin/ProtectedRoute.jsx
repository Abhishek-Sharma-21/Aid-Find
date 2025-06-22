import React from "react";
import { Navigate } from "react-router-dom";

// Protect route based on token in localStorage
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  // If token doesn't exist, redirect to login page
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, allow access to the protected route (render children)
  return children;
};

export default ProtectedRoute;
