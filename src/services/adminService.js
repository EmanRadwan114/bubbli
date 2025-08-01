// services/adminService.js
import api from "../utils/apiUrl";

export const addAdmin = async (adminData) => {
  const response = await api.post("/auth/register", {
    ...adminData,
    role: "admin",
  });
  return response.data;
};

export const getAdminById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getAdmins = async (page = 1, limit = 6) => {
  const response = await api.get(
    `/users?role=admin&page=${page}&limit=${limit}`
  );
  return response.data;
};

export const updateAdmin = async (id, updatedData) => {
  const response = await api.put(`/users/${id}`, updatedData);
  return response.data;
};

// Home Dashboard
export const getDashboardMetric = async (params) => {
  const { type, metric, year, month } = params;

  const query = new URLSearchParams();
  query.append("type", type);
  query.append("metric", metric);
  if (year) query.append("year", year);
  if (month) query.append("month", month);

  const { data } = await api.get(
    `/admins/dashboard-stats?${query.toString()}`
  );

  return data;
};
