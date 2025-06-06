import { createContext } from "react";

export const CouponContext = createContext();

export default function CouponContextProvider({ children }) {
  return <CouponContext.Provider value={{}}>{children}</CouponContext.Provider>;
}
