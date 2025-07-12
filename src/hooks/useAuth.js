import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  loginUserWithGoogle,
  registerUser,
} from "../services/authService";
import { toast } from "react-toastify";

// ^register
export const useUserRegister = () => {
  return useMutation({
    mutationFn: (data) => registerUser(data),
    onError: (error) => {
      toast.error(error?.response.data.message);
    },
  });
};
// ^login
export const useUserLogin = () => {
  return useMutation({
    mutationFn: (data) => loginUser(data),
    onError: (error) => {
      toast.error(error?.response.data.message);
    },
  });
};
// ^google login
export const useUserGoogleLogin = () => {
  return useMutation({
    mutationFn: (token) => loginUserWithGoogle(token),
    onError: (error) => {
      console.log(error);
      toast.error(error?.response.data.message);
    },
  });
};
