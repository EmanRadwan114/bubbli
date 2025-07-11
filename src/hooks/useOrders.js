import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrdersContext } from "../context/OrdersContext.jsx";

export const useOrders = () => {
  const { getCartItems, getShippingPrice, createOrder, checkout } =
    useOrdersContext();

  const queryClient = useQueryClient();

  // Fetch cart items
  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cartItems"],
    queryFn: getCartItems,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // clear cart cache
      queryClient.invalidateQueries(["cartItems"]);
    },
  });

  return {
    cartData,
    isCartLoading,
    isCartError,
    cartError,
    refetchCart,

    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isLoading,

    getShippingPrice,
    checkout,
  };
};
