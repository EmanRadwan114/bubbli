import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { toast } from "react-toastify";
import { useAllWishlist } from "../../hooks/useWishlist";
import { useParams } from "react-router";
import { getAllProducts, getProductByCategoryName } from "../../hooks/useProducts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import img from "../../assets/images/emptyCart.png";
import Pagination from "../../components/Pagination/Pagination";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
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
  } = categoryName ? getProductByCategoryName(categoryName, currentPage) : getAllProducts(currentPage);
  function handlePagination(value) {
    setCurrentPage(value);
  }
  // const { data, isLoading, isError, error } = useAllWishlist();
  const [wishlistArr, setWishlistArr] = useState([]);

  const onAddToCart = () => {
    toast.success("Product is added to Wishlist");
  };

  const onAddToWishlist = (id) => {
    if (wishlistArr.includes(id)) {
      setWishlistArr([...wishlistArr.filter((item) => item !== id)]);
      toast.success("Product is removed from Wishlist");
    } else {
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
                  <ProductCard product={product} onAddToWishlist={onAddToWishlist} onAddToCart={onAddToCart} wishlistArr={wishlistArr} />
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
              <Pagination currentPage={currentPage} totalPages={totalPages} handlePagination={handlePagination}></Pagination>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
