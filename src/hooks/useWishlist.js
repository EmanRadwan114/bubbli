import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addToWishlist,
  getAllUserWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

export const useAllWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getAllUserWishlist,
  });
};

export const useAddToWishlist = () => {
  return useMutation({
    mutationFn: (id) => addToWishlist(id),
    onError: (error) => {
      console.log(error);
      toast.error(error?.response.data.message);
    },
  });
};
export const useRemoveFromWishlist = () => {
  return useMutation({
    mutationFn: (id) => removeFromWishlist(id),
    onError: (error) => {
      console.log(error);
      toast.error(error?.response.data.message);
    },
  });
};
