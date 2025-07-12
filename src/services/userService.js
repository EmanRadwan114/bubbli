//just a js file for storing api methods related to user
import { useContext } from "react";
import api from "../utils/apiUrl";
import { AuthContext } from "../context/AuthContext";

export const fetchProfileData = async () => {
  const res = await api.get(`/users/me`);
  return res.data;
};

export const fetchUserOrders = async (page = 1, limit = 3) => {
  const res = await api.get(`/orders/me?page=${page}&limit=${limit}`);
  return res.data;
};

export const changeUserData = async (data) => {
  const res = await api.put(`/users/me`, data);
  return res.data;
};

export const logout = async (data) => {
  localStorage.removeItem("user");
  const { setUser } = useContext(AuthContext);
  setUser(null);
  const res = await api.post(`/auth/logout`, data);
  return res.data;
};

export const refundOrder = async (id) => {
  console.log(id);
  try {
    const res = await api.post(`/orders/cancel/${id}`, {});
    return res.message;
  } catch (error) {
    throw error.response.data.message;
  }
};
