import { useQuery } from "@tanstack/react-query";
import { getAllUserWishlist } from "../services/wishlistService";

export const useAllWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getAllUserWishlist,
  });
};
