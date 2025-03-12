// components/IsAdmin.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function IsAdmin({ children }) {
  const { isLoggedIn, isLoading, user } = useAuth();
  
  // If auth is still loading, show loading state or return null
  if (isLoading) return <div>Loading...</div>;
  
  // If not logged in or not admin, redirect to home
  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  // If admin, render the children
  return children;
}

export default IsAdmin;
