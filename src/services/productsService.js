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

// reviews 
export const getReviews = async (id, page) => {
  const response = await api.get(`/products/${id}/reviews?page=${page}`);
  console.log("", response.data);
  return response.data;
};

export const addReview = async (id, details) => {
  const response = await api.post(`/products/${id}/reviews`, details);
  return response.data;
};

// ADD Product
export const addProduct = async (newProductData) => {
  const res = await api.post("/products", newProductData);
  return res.data;
};

// DELETE product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// UPDATE product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};