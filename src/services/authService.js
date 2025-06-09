//just a js file for storing api methods related to the auth part of the website
import api from "../utils/apiUrl";

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
export const loginUserWithGoogle = async (token) => {
  const response = await api.post("/auth/login/google", {
    token,
  });
  return response.data;
};
