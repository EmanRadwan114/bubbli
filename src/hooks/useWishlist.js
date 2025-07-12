import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import {
  addToWishlist,
  clearWishlist,
  getAllUserWishlist,
  getUserWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { WishlistContext } from "../context/Wishlist.Context";
import { AuthContext } from "../context/AuthContext";

export const useAllWishlist = () => {
  const { setAllUserWishlist } = useContext(WishlistContext);

  return useQuery({
    queryKey: ["all-wishlist"],
    queryFn: getAllUserWishlist,
    onSuccess: (data) => {
      setAllUserWishlist(data.wishlist);
    },
  });
};
export const useFetchWishlist = (page = 1) => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryKey: ["user-wishlist", page],
    queryFn: () => getUserWishlist(page),
    keepPreviousData: true,
    enabled: !!user,
  });
};

// ✅ Fix for useAddToWishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  return useMutation({
    mutationFn: (id) => {
      if (!user) {
        toast.error("Login to add product to wishlist");
        return Promise.reject("User not logged in");
      }
      return addToWishlist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-wishlist"]);
      toast.success("Product is added to Wishlist");
    },
    onError: (error) => {
      toast.error("Login to add product to wishlist");
      console.log(error);
    },
  });
};
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  return useMutation({
    mutationFn: (id) => {
      if (!user) {
        toast.error("Login to remove product from wishlist");
        return Promise.reject("User not logged in");
      }
      return removeFromWishlist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-wishlist"]);
      toast.success("Product is removed from Wishlist");
    },
    onError: (error) => {
      toast.error("Login to remove product from wishlist");
      console.log(error);
    },
  });
};
export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  return useMutation({
    mutationFn: () => {
      if (!user) {
        toast.error("Login to clear wishlist");
        return Promise.reject("User not logged in");
      }
      return clearWishlist();
    },
    onSuccess: () => {
      toast.success("Wishlist is cleared successfully");
      queryClient.invalidateQueries(["user-wishlist"]);
    },
    onError: (error) => {
      toast.error("Login to clear wishlist");
      console.log(error);
    },
  });
};
