import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import {
  addToWishlist,
  getAllUserWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { WishlistContext } from "../context/Wishlist.Context";

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

// ✅ Fix for useAddToWishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: (id) => addToWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-wishlist"]);
      toast.success("Product is added to Wishlist");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: (id) => removeFromWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-wishlist"]);
      toast.success("Product is removed from Wishlist");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};
