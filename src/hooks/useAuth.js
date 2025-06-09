import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../services/authService";
import { toast } from "react-toastify";

export const useUserRegister = () => {
  return useMutation({
    mutationFn: (data) => registerUser(data),
    onError: (error) => {
      toast.error(error?.response.data.message);
    },
  });
};
export const useLoginRegister = (navigate) => {
  return useMutation({
    mutationFn: (data) => loginUser(data),
    onError: (error) => {
      toast.error(error?.response.data.message);
    },
  });
};
