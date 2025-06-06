import { createContext } from "react";

export const OrdersContext = createContext();

export default function OrdersContextProvider({ children }) {
  return <OrdersContext.Provider value={{}}>{children}</OrdersContext.Provider>;
}
