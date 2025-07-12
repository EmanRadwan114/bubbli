// *Example
// import { useQuery } from "@tanstack/react-query";
// import { fetchUser } from "../services/userService";

import { useMutation } from "@tanstack/react-query";
import { addToCartApi } from "../services/cartService";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAddToCart = () => {
  const { user } = useContext(AuthContext);

  return useMutation({
    mutationFn: (id) => {
      if (!user) {
        toast.error("Login to add product to cart");
        return Promise.reject("User not logged in");
      }
      return addToCartApi(id);
    },
    onSuccess: () => {
      toast.success("Product added to cart");
    },
    onError: (error) => {
      toast.error("Login to add product to cart");
      console.log(error);
    },
  });
};
