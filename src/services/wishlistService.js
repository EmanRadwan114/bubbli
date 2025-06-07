import api from "../utils/apiUrl";

//just a js file for storing api methods related to wishlist
export const getAllUserWishlist = async () => {
  const res = await api.get("/wishlist?all=true");
  console.log(res);

  return res.data;
};
