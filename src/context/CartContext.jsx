import { AuthContext } from "./AuthContext";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { createContext, useContext, useEffect, useState } from "react";
// import { editQuantity, getCartItems, removeCart } from "../services/cartApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useState, useContext } from "react";

import {
  editQuantity,
  getCartItems,
  removeCart,
  addToCartApi,
} from "../services/cartService";
import { useAuth } from "./AuthContext";
export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  // Run cart logic only if user is logged in
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["cartItems", page],
    queryFn: () => getCartItems(page),
    enabled: !!user?.role === "user",
  });

  const mutation = useMutation({
    mutationFn: removeCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["cartItems", page]);

      const latestData = queryClient.getQueryData(["cartItems", page]) || [];

      if (page > 1 && latestData.data.length === 0) {
        setPage((val) => val - 1);
      } else {
        await queryClient.invalidateQueries(["cartItems", page]);
      }
    },
  });
  const mutationQuantity = useMutation({
    mutationFn: editQuantity,
    onSuccess: () => {
      refetch?.();
    },
  });

  const handleCartRemoval = (id) => {
    if (user) mutation.mutate(id);
  };

  const handleQuantity = (id, quantity) => {
    if (!user) return;

    if (quantity === 0) {
      mutation.mutate(id);
    } else {
      mutationQuantity.mutate({ id, quantity });
    }
  };

  // Add to Cart
  const addToCartMutation = useMutation({
    mutationFn: (productId) => addToCartApi(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    },
  });

  return (
    <CartContext.Provider
      value={{
        data: user ? data : { data: [] },
        isLoading: user ? isLoading : false,
        refetch: user ? refetch : () => {},
        handleCartRemoval,
        page,
        setPage,
        handleQuantity,
        addToCart: addToCartMutation.mutate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
