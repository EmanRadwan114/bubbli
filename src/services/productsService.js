//just a js file for storing api methods related to products
import api from "../utils/apiUrl";
// Get Product By Category
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
export const getAllProductsBack = async (page = 1, limit = 6) => {
  const path = `/products`;
  try {
    const response = await api.get(path, {
      params: { page, limit },
    });
    console.log("→ Got response:", response.status, response.data);
    return response.data;
  } catch (err) {
    console.error("getAllProducts failed:", err);
    throw err;
  }
};
// Get Product By ID
// export const getProductById = async (id) => {
//   const path = `/products/${id}`;
//   try {
//     const response = await api.get(path)
//     console.log("specific product response:", response.status, response.data);
//     return response.data;
//   } catch (err) {
//     console.error("getProductByID failed:", err);
//     throw err;
//   }
// };
// Get Product By ID
export const getProductById = async (id) => {
  const path = `/products/${id}`;
  try {
    const response = await api.get(path);
    console.log("specific product response:", response.status, response.data);
    return response.data;
  } catch (err) {
    console.error("getProductByID failed:", err);
    throw err;
  }
};
