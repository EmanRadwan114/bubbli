// src/context/OrdersContext.js
import { createContext, useContext } from "react";
import * as ordersService from "../services/orderService";

const OrdersContext = createContext();

export function OrdersContextProvider({ children }) {
  return (
    <OrdersContext.Provider value={ordersService}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context)
    throw new Error("useOrders must be used within OrdersContextProvider");
  return context;
};
