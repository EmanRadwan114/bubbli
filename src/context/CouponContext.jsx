import { createContext, useContext, useState } from "react";

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const setAppliedCouponCode = (code, discount) => {
    setAppliedCoupon({ code, discount });
  };

  const clearCoupon = () => setAppliedCoupon(null);

  return (
    <CouponContext.Provider
      value={{ appliedCoupon, setAppliedCouponCode, clearCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCouponContext = () => useContext(CouponContext);
