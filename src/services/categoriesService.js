//just a js file for storing api methods related to categories
import api from "../utils/apiUrl";

export const getAllCategories = async () => {
  const response = await api.get("/categories");
  return response.data.data;
};
