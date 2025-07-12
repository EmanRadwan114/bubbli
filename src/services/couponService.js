import api from "../utils/apiUrl";

//^ Get All Coupons
export const getAllCoupons = async (page = 1, limit = 6) => {
  const response = await api.get(`/coupons?page=${page}&limit=${limit}`, {
    withCredentials: true,
  });
  return response.data;
};

//^ Get Coupon By ID
export const getCouponById = async (id) => {
  const response = await api.get(`/coupons/${id}`, { withCredentials: true });
  return response.data;
};

//^ Add New Coupon
export const addCoupon = async (newCoupon) => {
  console.log("Sending to server:", newCoupon);
  const response = await api.post("/coupons", newCoupon, {
    withCredentials: true,
  });
  return response.data;
};

//^ Update Coupon By ID
export const updateCoupon = async (id, updatedCoupon) => {
  const response = await api.put(`/coupons/${id}`, updatedCoupon, {
    withCredentials: true,
  });
  return response.data;
};

//^ Apply Coupon
export const applyCoupon = async (couponCode) => {
  const response = await api.post(
    "/coupons/apply-coupon",
    { couponCode },
    { withCredentials: true }
  );
  return response.data;
};

//^ Delete Coupon By ID
export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupons/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
