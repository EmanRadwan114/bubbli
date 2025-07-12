import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router";
import { toast } from "react-toastify";

export default function RequireUser({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.error("Please log in to access this page!");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "user") {
    toast.error("This page is for users only!");
    return <Navigate to="/" replace />;
  }

  return children;
}
