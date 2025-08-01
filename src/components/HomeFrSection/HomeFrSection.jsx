import React, { useContext, useEffect, useState } from "react";
import { Gift, Star, Zap, Flame, Clock, BadgePercent } from "lucide-react";
import {
  useAddToWishlist,
  useAllWishlist,
  useRemoveFromWishlist,
} from "../../hooks/useWishlist";
import { useAddToCart } from "../../hooks/useCart";
import ProductCard from "../ProductCard/ProductCard";
import { useFeaturedProducts } from "../../hooks/useProducts";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { WishlistContext } from "../../context/Wishlist.Context";
import { useCart } from "../../context/CartContext";

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState("bestseller");
  const {
    data: allProducts,
    isLoading,
    isError,
  } = useFeaturedProducts(activeTab);
  const { allUserWishlist, setAllUserWishlist } = useContext(WishlistContext);

  // Tab configuration
  const tabs = [
    {
      id: "bestseller",
      label: "Bestsellers",
      icon: <Star className="w-4 h-4" />,
      filter: (product) => product.label?.includes("bestseller"),
    },
    {
      id: "new",
      label: "New Arrivals",
      icon: <Zap className="w-4 h-4" />,
      filter: (product) => product.label?.includes("new"),
    },
    {
      id: "hot",
      label: "Hot Items",
      icon: <Flame className="w-4 h-4" />,
      filter: (product) => product.label?.includes("hot"),
    },
    {
      id: "limited",
      label: "Limited",
      icon: <Clock className="w-4 h-4" />,
      filter: (product) => product.label?.includes("limited"),
    },
    {
      id: "deal",
      label: "Special Deals",
      icon: <BadgePercent className="w-4 h-4" />,
      filter: (product) => product.label?.includes("deal"),
    },
  ];

  // Get current tab's filter function
  const currentFilter = tabs.find((tab) => tab.id === activeTab)?.filter;
  const filteredProducts =
    allProducts?.data?.filter(currentFilter).slice(0, 8) || [];

  const { mutateAsync: addProToWishlist } = useAddToWishlist();
  const { mutateAsync: removeProFromWishlist } = useRemoveFromWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (id) => {
    await addToCart(id);
  };

  const handleWishlistToggle = async (id) => {
    const isInWishlist = allUserWishlist.includes(id);

    try {
      if (isInWishlist) {
        await removeProFromWishlist(id);
        setAllUserWishlist((prev) => prev.filter((itemId) => itemId !== id));
      } else {
        await addProToWishlist(id);
        setAllUserWishlist((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error while updating wishlist:", error);
    }
  };

  if (isError) {
    return (
      <div className="light-main-bg dark-main-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl text-primary dark:text-primary-dark">
            Failed to load products
          </h2>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="light-secondary-bg dark-secondary-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Gift className="text-primary dark:text-primary-dark w-8 h-8 mr-3" />
            <h2 className="text-3xl font-bold text-dark dark:text-light">
              Shop By Collection
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Curated selections for every taste
          </p>
        </div>

        {/* Tab Navigation */}
        <nav className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary dark:bg-primary-dark text-white"
                  : "light-main-bg dark-main-bg hover:bg-opacity-80"
              }`}
            >
              <span className="mr-2">
                {React.cloneElement(tab.icon, {
                  className: `w-4 h-4 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-primary dark:text-primary-dark"
                  }`,
                })}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Product Grid */}

        {isLoading ? (
          <div className="min-h-screen">
            <LoadingSpinner />;
          </div>
        ) : (
          <div className="flex flex-wrap sm:flex-row items-center justify-center gap-10 sm:gap-20 md:px-16  ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToWishlist={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  wishlistArr={allUserWishlist}
                />
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No products found in this collection
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
