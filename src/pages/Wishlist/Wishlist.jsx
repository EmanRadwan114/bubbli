import React from "react";
import { useAllWishlist, useRemoveFromWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProductCard from "../../components/ProductCard/ProductCard"; // ✅ import correctly

const Wishlist = () => {
  const { data, isLoading, isError, error } = useAllWishlist();
  const { mutate: removeFromWishlist, isPending } = useRemoveFromWishlist();
  const { addToCart } = useCart();

  const wishlist = data?.data || [];

  const handleAddToCart = (id) => {
    toast.success("Item added to cart");
    addToCart(id);
  };

  const handleRemoveFromWishlist = (id) => {
    removeFromWishlist(id);
  };

  if (isLoading || isPending) return <LoadingSpinner />;

  if (isError) {
    toast.error(error?.response?.data?.message || "Failed to fetch wishlist");
    return (
      <div className="text-center py-10 text-red-500">
        Error loading wishlist.
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          My Wishlist
        </h2>

        {wishlist.length === 0 ? (
          <div className="text-center py-10">
            <HeartOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-700 mb-2">
              Your wishlist is empty.
            </p>
            <p className="text-gray-500 mb-4">
              Start adding products to your wishlist.
            </p>
            <Link
              to="/gifts"
              className="inline-block bg-primary text-white font-semibold px-6 py-2 rounded hover:bg-primary-dark transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlistArr={wishlist.map((item) => item._id)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleRemoveFromWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
