//just a js file for storing api methods related to categories
import api from "../utils/apiUrl";

export const getAllCategories = async () => {
  const response = await api.get("/categories");
  return response.data.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data.data;
};

export const addCategory = async (newCategory) => {
  const response = await api.post("/categories/add", newCategory, {
    withCredentials: true,
  });
  return response.data;
};

export const updateCategory = async (id, updatedCat) => {
  const response = await api.put(`/categories/${id}`, updatedCat, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
