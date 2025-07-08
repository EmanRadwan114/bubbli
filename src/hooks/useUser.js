import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { changeUserData, fetchProfileData, fetchUserOrders, logout, refundOrder } from "../services/userService";

export const useProfileData = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfileData(),
    keepPreviousData: true,
  });
};

export const useUserOrders = (currentPage) => {
  return useQuery({
    queryKey: ["orders", currentPage],
    queryFn: () => fetchUserOrders(currentPage),
    keepPreviousData: true,
  });
};
export const refund = (orderId) => {
  return useQuery({
    queryKey: ["refund", orderId],
    queryFn: () => refundOrder(orderId),
    keepPreviousData: true,
  });
};
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => changeUserData(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["profile"]);
      toast.success("Profile updated successfully!");

      // If email was changed, log out and redirect to login
      if (variables.email && variables.email !== queryClient.getQueryData(["profile"])?.data?.email) {
        logout();
        navigate("/login");
      }
    },
    onError: (error) => {
      toast.error(error.response.data.errors?.[0].message || error.response.data.message);
    },
  });
};

export const useUpdatePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => changeUserData(data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      logout();
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response.data.errors?.[0].message || error.response.data.message);
    },
  });
};
