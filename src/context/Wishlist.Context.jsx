import { createContext, useState } from "react";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
  const [allUserWishlist, setAllUserWishlist] = useState([]);
  return (
    <WishlistContext.Provider value={{ allUserWishlist, setAllUserWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
