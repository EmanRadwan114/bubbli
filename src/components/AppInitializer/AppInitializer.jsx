import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { setupAxiosInterceptors } from "../../utils/apiInterceptor";
import api from "../../utils/apiUrl";

export default function AppInitializer() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(api, logout, navigate, toast);
  }, [logout, navigate]);

  return null;
}
