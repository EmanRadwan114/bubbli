import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrdersContext } from "../context/OrdersContext.jsx";
import orderService from "../services/orderService";

// ✅ Regular User & Checkout logic
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

// ✅ Get single order by ID
export const useOrder = (orderId) =>
  useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrderDetails(orderId),
    enabled: !!orderId,
  });

// ✅ ADMIN: Get all orders with pagination
export const useGetAllOrders = (page, limit) =>
  useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => orderService.getAllOrders(page, limit),
    keepPreviousData: true,
  });

// ✅ ADMIN: Get orders by month for reports
export const useGetOrdersByMonth = (year) =>
  useQuery({
    queryKey: ["ordersByMonth", year],
    queryFn: () => orderService.getOrdersByMonth(year),
    enabled: !!year,
  });

// ✅ ADMIN: Delete an order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
};

// ✅ ADMIN: Update shipping status
export const useUpdateShippingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, shippingStatus }) =>
      orderService.updateOrderShippingStatus(id, shippingStatus),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["order"]);
    },
  });
};

// ✅ USER: My Orders
export const useMyOrders = () =>
  useQuery({
    queryKey: ["myOrders"],
    queryFn: () => orderService.getMyOrders(),
  });
