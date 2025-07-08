import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { toast } from "react-toastify";
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
import img from "../../assets/images/emptyCart.png";
import Pagination from "../../components/Pagination/Pagination";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { getAllUserWishlist } from "../../services/wishlistService";
import { useAddToCart } from "../../hooks/useCart";
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
  const {
    data: allWishlist,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
    error: wishlistError,
  } = useAllWishlist();

  const [wishlistArr, setWishlistArr] = useState([]);

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

  const {
    mutateAsync: addProToCart,
    isPending: pendingAddToCart,
    isSuccess: addToCartSuccess,
  } = useAddToCart();

  useEffect(() => {
    if (allWishlist) {
      const arr = allWishlist?.data?.map((item) => {
        return item._id;
      });
      setWishlistArr([...arr]);
    }
  }, [allWishlist]);

  const onAddToCart = async (id) => {
    await addProToCart(id);
    toast.success("Product is added to Cart");
  };

  const onAddToWishlist = async (id) => {
    if (wishlistArr?.includes(id)) {
      await removeProFromWishlist(id);
      setWishlistArr([...wishlistArr.filter((item) => item !== id)]);
      toast.success("Product is removed from Wishlist");
    } else {
      await addProToWishlist(id);
      setWishlistArr([...wishlistArr, id]);
      toast.success("Product is added to Wishlist");
    }
  };

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <>
      <Breadcrumb></Breadcrumb>
      <div className="flex">
        <div className="md:flex-1/5"></div>
        <div className="flex flex-col md:flex-4/5">
          <div className="flex flex-wrap justify-center my-4">
            {productList.length > 0 &&
              productList.map((product, indx) => (
                <div className="w-full md:w-6/12 lg:w-4/12 p-2" key={indx}>
                  <ProductCard
                    product={product}
                    onAddToWishlist={onAddToWishlist}
                    onAddToCart={onAddToCart}
                    wishlistArr={wishlistArr}
                  />
                </div>
              ))}
            {productList.length <= 0 && (
              <div className="min-h-dvh flex justify-center items-center flex-col gap-5">
                <img src={img} alt="no products found" className="w-3/12"></img>
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
    </>
  );
}
