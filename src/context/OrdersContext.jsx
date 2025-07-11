import React, { createContext, useContext, useMemo } from "react";
import orderService from "../services/orderService";

const OrdersContext = createContext();

export const OrdersContextProvider = ({ children }) => {
  const getCartItems = () => {
    return orderService.getCartItems();
  };

  const getShippingPrice = () => {
    return orderService.getShippingPrice();
  };

  const createOrder = (orderData) => {
    return orderService.createOrder(orderData);
  };

  const checkout = (iframeUrl) => {
    window.location.href = iframeUrl;
  };

  const value = useMemo(
    () => ({
      getCartItems,
      getShippingPrice,
      createOrder,
      checkout,
    }),
    []
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

export const useOrdersContext = () => useContext(OrdersContext);
