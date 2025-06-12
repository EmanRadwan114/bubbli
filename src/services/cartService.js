//just a js file for storing api methods related to cart
import api from "../utils/apiUrl";

export const addToCart = async (id) => {
  const res = await api.post(`/cart`, { productId: id });
  return res.data;
};
