//just a js file for storing api methods related to products
import api from "../utils/apiUrl";
export const getProductByCategory = async (categoryName, page, limit) => {
  const path = `/products/category/${encodeURIComponent(categoryName)}`;
  try {
    const response = await api.get(path, {
      params: { page, limit },
    });
    console.log("→ Got response:", response.status, response.data);
    return response.data;
  } catch (err) {
    console.error("getProductByCategory failed:", err);
    throw err;
  }
};
