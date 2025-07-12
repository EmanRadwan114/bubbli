//just a js file for storing api methods related to wishlist
import api from "../utils/apiUrl";

export const getAllUserWishlist = async () => {
  const res = await api.get("/wishlist?all=true");
  return res.data;
};
export const getUserWishlist = async (page = 1, limit = 8) => {
  const res = await api.get(`/wishlist?page=${page}&limit=${limit}`);
  return res.data;
};

export const addToWishlist = async (id) => {
  const res = await api.put(`/wishlist/${id}`);
  return res.data;
};
export const removeFromWishlist = async (id) => {
  const res = await api.delete(`/wishlist/${id}`);
  return res.data;
};
export const clearWishlist = async (id) => {
  const res = await api.delete(`/wishlist`);
  return res.data;
};
