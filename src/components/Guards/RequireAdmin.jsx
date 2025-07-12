import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function RequireAdmin() {
  const { loading } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    toast.error("You are not authorized to access the admin dashboard");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
