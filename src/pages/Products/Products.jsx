import { useContext, useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  useAddToWishlist,
  useAllWishlist,
  useRemoveFromWishlist,
} from "../../hooks/useWishlist";
import { useParams } from "react-router";
import {
  getAllProducts,
  getProductByCategoryName,
} from "../../hooks/useProducts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import img from "../../assets/images/emptyCart.svg";
import Pagination from "../../components/Pagination/Pagination";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { WishlistContext } from "../../context/Wishlist.Context";
import { useCart } from "../../context/CartContext";
import FilterSidebar from "../../components/FilterationSideNav/FilterationSideNav";
export default function Products() {
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  // const {
  //   data: { data: categoryData = [], totalPages: catTotalPages = 1 } = {},
  //   isLoading: isCatLoading,
  //   isError: isCatError,
  //   error: catError,
  // } = getProductByCategoryName(categoryName, currentPage);

  // const {
  //   data: { data: products = [], totalPages: totalPages = 1 } = {},
  //   isLoading: isProductsLoad,
  //   isError: isProductsError,
  //   error: productsError,
  // } = getAllProducts(currentPage);

  const {
    data: { data: productList = [], totalPages = 1 } = {},
    isLoading,
    isError,
    error,
  } = categoryName
    ? getProductByCategoryName(categoryName, currentPage)
    : getAllProducts(currentPage);

  function handlePagination(value) {
    setCurrentPage(value);
  }

  const { allUserWishlist, setAllUserWishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();

  const {
    mutateAsync: addProToWishlist,
    isPending: pendingAddToWishlist,
    isSuccess: addToWishlistSuccess,
  } = useAddToWishlist();
  const {
    mutateAsync: removeProFromWishlist,
    isPending: pendingRemoveFromWishlist,
    isSuccess: removeFromWishlistSuccess,
  } = useRemoveFromWishlist();

  const onAddToCart = async (id) => {
    await addToCart(id);
  };

  const onAddToWishlist = async (id) => {
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

  return (
    <>
      <Breadcrumb></Breadcrumb>
      
      {isLoading ? (
        <div className="min-h-screen">
          <LoadingSpinner />;
        </div>
      ) : (
        <div className="flex">
          <div className="md:flex-1/5">
          <FilterSidebar/>
          </div>
          <div className="flex flex-col md:flex-4/5">
            <div className="flex flex-wrap justify-center my-4">
              {productList.length > 0 &&
                productList.map((product, indx) => (
                  <div className="w-full md:w-6/12 lg:w-4/12 p-2" key={indx}>
                    <ProductCard
                      product={product}
                      onAddToWishlist={onAddToWishlist}
                      onAddToCart={onAddToCart}
                      wishlistArr={allUserWishlist}
                    />
                  </div>
                ))}
              {productList.length <= 0 && (
                <div className="flex justify-center items-center flex-col gap-5 relative my-20">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/17569/17569003.png"
                    alt="no products found"
                    className="w-6/12"
                  ></img>
                  <p className="font-semibold">Sorry, No products found!</p>
                </div>
              )}
            </div>
            <div>
              {productList.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePagination={handlePagination}
                ></Pagination>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
