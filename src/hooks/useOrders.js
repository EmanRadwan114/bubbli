// *Example
// import { useQuery } from "@tanstack/react-query";
// import { fetchUser } from "../services/userService";

import { useQuery } from "@tanstack/react-query";
import { getOrderDetails } from "../services/orderService";

// export const useUser = () => {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: fetchUser,
//   });
// };
export const useOrder = (orderId) => {
  return useQuery({
  queryKey: ["order", orderId],
  queryFn: () => getOrderDetails(orderId),
  enabled: !!orderId,
});
}