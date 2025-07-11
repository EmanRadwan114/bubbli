import api from "../utils/apiUrl";

const SHIPPING_PRICE = 50;

export const getShippingPrice = () => SHIPPING_PRICE;

export const getCartItems = () => api.get("/cart/checkout");

export const createOrder = (orderData) => api.post("/orders", orderData);

export async function getOrderDetails(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export default {
  createOrder,
  getCartItems,
  getShippingPrice,
};
