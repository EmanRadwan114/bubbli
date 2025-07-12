import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../components/Pagination/Pagination";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import FilterSidebar from "../../components/FilterationSideNav/FilterationSideNav";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../hooks/useWishlist";
import {
  getAllProducts,
  getProductByCategoryName,
  // filterProducts,
} from "../../hooks/useProducts";
import { WishlistContext } from "../../context/Wishlist.Context";
import { useCart } from "../../context/CartContext";

export default function Products() {
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    price: 1000,
    category: categoryName || "",
  });
  
  const { allUserWishlist = [], setAllUserWishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();

  // Fetch products based on filters and category
  const {
    data: productsData = { data: [], totalPages: 1 },
    isLoading,
    isError,
    error,
  } = categoryName && !filters.category
    ? getProductByCategoryName(categoryName, currentPage)
    : filterProducts(filters, currentPage);

  const { data: productList = [], totalPages = 1 } = productsData;

  // Wishlist mutations
  const { mutateAsync: addProToWishlist } = useAddToWishlist();
  const { mutateAsync: removeProFromWishlist } = useRemoveFromWishlist();

  // Handle filter changes from sidebar
  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Preserve URL category if it exists
      category: categoryName || newFilters.category || ""
    }));
  };

  // Add to cart handler
  const onAddToCart = async (id) => {
    try {
      await addToCart(id);
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  // Wishlist handler
  const onAddToWishlist = async (id) => {
    try {
      const isInWishlist = allUserWishlist.includes(id);
      
      if (isInWishlist) {
        await removeProFromWishlist(id);
        setAllUserWishlist(prev => prev.filter(itemId => itemId !== id));
        toast.success("Removed from wishlist!");
      } else {
        await addProToWishlist(id);
        setAllUserWishlist(prev => [...prev, id]);
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  // Pagination handler
  const handlePagination = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    toast.error(error?.message || "Failed to load products");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange}
          initialCategory={categoryName}
        />
        
        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {productList.length > 0 ? (
              productList.map((product) => (
                <div key={product._id} className="w-full p-2">
                  <ProductCard
                    product={product}
                    onAddToWishlist={onAddToWishlist}
                    onAddToCart={onAddToCart}
                    isInWishlist={allUserWishlist.includes(product._id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-20">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/17569/17569003.png"
                  alt="No products found"
                  className="w-1/2 max-w-xs"
                />
                <p className="font-semibold text-lg mt-4">
                  {filters.category 
                    ? `No products found in ${filters.category} category`
                    : "No products match your filters"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {productList.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePagination={handlePagination}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}