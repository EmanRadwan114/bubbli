import api from "../utils/apiUrl";

// Constants
const SHIPPING_PRICE = 50;

// Get static shipping price
export const getShippingPrice = () => SHIPPING_PRICE;

// Get cart checkout items
export const getCartItems = () => api.get("/cart/checkout");

// Create new order
export const createOrder = (orderData) =>
  api.post("/orders", orderData, { withCredentials: true });

// Get order details by ID
export const getOrderDetails = (id) =>
  api
    .get(`/orders/${id}`, { withCredentials: true })
    .then((res) => res.data.data);

// Admin - Get all orders paginated
export const getAllOrders = (page = 1, limit = 6) =>
  api.get(`/orders?page=${page}&limit=${limit}`, { withCredentials: true });

// User - Get my orders
export const getMyOrders = () =>
  api.get("/orders/me", { withCredentials: true });

// Admin - Update order shipping status
export const updateOrderShippingStatus = (id, shippingStatus) =>
  api.put(`/orders/${id}`, { shippingStatus }, { withCredentials: true });

// Admin - Delete order by ID
export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`, { withCredentials: true });

// Admin - Get orders data by month (for reports)
export const getOrdersByMonth = (year) =>
  api.get(`/orders/orders-by-month?year=${year}`, { withCredentials: true });

export default {
  getShippingPrice,
  getCartItems,
  createOrder,
  getOrderDetails,
  getAllOrders,
  getMyOrders,
  updateOrderShippingStatus,
  deleteOrder,
  getOrdersByMonth,
};
