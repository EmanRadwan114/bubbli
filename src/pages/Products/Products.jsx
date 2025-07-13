import { useContext, useState, useCallback } from "react";
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
import { WishlistContext } from "../../context/Wishlist.Context";
import { useCart } from "../../context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { getProductByCategoryName } from "./../../hooks/useProducts";
import {
  getAllProductsBack,
  filterProducts,
} from "../../services/productsService";

export default function Products() {
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ title: "", price: 150 });

  const { allUserWishlist = [], setAllUserWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useCart();

  // Category or all-products query
  const {
    data: { data: productList = [], totalPages = 1 } = {},
    isLoading: catLoading,
    isError: catErrorFlag,
    error: catError,
  } = categoryName
    ? getProductByCategoryName(categoryName, currentPage)
    : getAllProductsBack(currentPage);

  // Filtered query
  const {
    data: {
      data: filteredProducts = [],
      totalPages: filteredTotalPages = 1,
    } = {},
    isLoading: filterLoading,
    isError: filterErrorFlag,
    error: filterError,
  } = useQuery({
    queryKey: ["filterProducts", filters, currentPage],
    queryFn: () => filterProducts(filters, currentPage),
    keepPreviousData: true,
  });

  const displayProducts =
    filters.title || filters.price !== 200
      ? filteredProducts
      : productList || [];

  const displayTotalPages =
    filters.title || filters.price !== 200 ? filteredTotalPages : totalPages;

  const loading =
    filters.title || filters.price !== 200 ? filterLoading : catLoading;
  const errorFlag =
    filters.title || filters.price !== 200 ? filterErrorFlag : catErrorFlag;
  const error = filters.title || filters.price !== 200 ? filterError : catError;

  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handlePagination = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onAddToCart = async (id) => {
    await addToCart(id);
  };

  const { mutateAsync: addProToWishlist } = useAddToWishlist();
  const { mutateAsync: removeProFromWishlist } = useRemoveFromWishlist();

  const onAddToWishlist = async (id) => {
    const exists = allUserWishlist.includes(id);
    if (exists) {
      await removeProFromWishlist(id);
      setAllUserWishlist((prev) => prev.filter((x) => x !== id));
    } else {
      await addProToWishlist(id);
      setAllUserWishlist((prev) => [...prev, id]);
    }
  };

  // show error toast once
  if (errorFlag) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch products"
    );
  }

  return (
    <>
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar always visible */}
          <div className="w-full md:w-72 flex-shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Inline spinner */}
            {loading ? (
              <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : displayProducts?.length === 0 ? (
              <div className="flex justify-center items-center flex-col gap-5 mt-20">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/17569/17569003.png"
                  alt="no products found"
                  className="w-48"
                />
                <p className="font-semibold text-gray-700">
                  {filters.title || filters.price !== 150
                    ? "No products match your filters"
                    : "Sorry, No products found!"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToWishlist={onAddToWishlist}
                      onAddToCart={onAddToCart}
                      wishlistArr={allUserWishlist}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={displayTotalPages}
                    handlePagination={handlePagination}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}