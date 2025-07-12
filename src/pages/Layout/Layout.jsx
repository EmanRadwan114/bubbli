import { Outlet, useLocation } from "react-router";
import Navbar from "./../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ChatWidget from "../../components/ChatWidget/ChatWidget.jsx";
import { useContext, useEffect } from "react";
import { WishlistContext } from "../../context/Wishlist.Context.jsx";
import { useAllWishlist } from "../../hooks/useWishlist.js";
import { useCart } from "../../context/CartContext.jsx";

import AppInitializer from "../../components/AppInitializer/AppInitializer.jsx";

export default function Layout() {
  const path = useLocation().pathname;

  const { pathname } = useLocation();

  const { allUserWishlist, setAllUserWishlist } = useContext(WishlistContext);
  const { data, refetch, setCartItems } = useCart();

  const {
    data: allWishlist,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
    error: wishlistError,
  } = useAllWishlist();

  useEffect(() => {
    if (allWishlist?.data) {
      const ids = allWishlist.data.map((item) => item._id);
      setAllUserWishlist(ids);
    }
  }, [allWishlist]);

  useEffect(() => {
    async function fetchData() {
      await refetch();
      setCartItems(data?.totalItems);
    }
    fetchData();
  }, [data]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Interceptor runs once here */}
      <AppInitializer />

      {path.includes("login") || path.includes("register") ? null : <Navbar />}

      <div
        className={`flex-grow ${
          path.includes("login") || path.includes("register") ? "pt-0" : "pt-16"
        }`}>
        <Outlet />
      </div>

      {/* Footer will automatically stick to bottom due to flex-col and min-h-screen */}
      {path.includes("login") || path.includes("register") ? null : <Footer />}

      {path.includes("login") || path.includes("register") ? null : (
        <ChatWidget />
      )}
    </div>
  );
}
