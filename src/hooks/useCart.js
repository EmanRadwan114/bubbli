// *Example
// import { useQuery } from "@tanstack/react-query";
// import { fetchUser } from "../services/userService";

import { useMutation } from "@tanstack/react-query";
import { addToCart } from "../services/cartService";
import { toast } from "react-toastify";

// export const useUser = () => {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: fetchUser,
//   });
// };

export const useAddToCart = () => {
  return useMutation({
    mutationFn: (id) => addToCart(id),
    onError: (error) => {
      console.log(error);
      toast.error(error?.response.data.message);
    },
  });
};
