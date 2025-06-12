import api from "../utils/apiUrl";

export const applyCoupon = async (couponCode) => {
  const response = await api.post("/coupons/apply-coupon", couponCode);
  return response.data;
};
