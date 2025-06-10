import api from "../utils/apiUrl";

export const getCartItems = async (page) => {
  const response = await api.get(`/cart?page=${page}`);
  console.log(response+"here is get all in card🎇")
  return response.data;
};

export const removeCart = async (id = undefined) => {
  let response;
  if (id) response = await api.delete(`/cart/${id}`);
  else response = await api.delete("/cart");

  return response.data;
};
export const editQuantity = async ({ id, quantity }) => {
  const response = await api.put(`/cart/${id}`, { quantity });
  console.log(response);
  return response.data;
};
export const addToCartApi = (productId) => {
  return api.post(
    "/cart",
    { productId },
   
  );
};