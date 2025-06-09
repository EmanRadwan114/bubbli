import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { toast } from "react-toastify";
import { useAllWishlist } from "../../hooks/useWishlist";
import { useParams } from "react-router";
import { getProductByCategoryName } from "../../hooks/useProducts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import img from "../../assets/images/emptyCart.png";
import Pagination from "../../components/Pagination/Pagination";
export default function Products() {
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: { data: categoryData = [], totalPages: catTotalPages = 1 } = {},
    isLoading: isCatLoading,
    isError: isCatError,
    error: catError,
  } = getProductByCategoryName(categoryName, currentPage);
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
  if (isCatLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <>
      <div className="flex">
        <div className="md:flex-1/5"></div>
        <div className="flex flex-col md:flex-4/5">
          <div className="flex flex-wrap justify-center my-4">
            {categoryData.length > 0 &&
              categoryData.map((product, indx) => (
                <div className="w-full md:w-6/12 lg:w-4/12 p-2" key={indx}>
                  <ProductCard product={product} onAddToWishlist={onAddToWishlist} onAddToCart={onAddToCart} wishlistArr={wishlistArr} />
                </div>
              ))}
            {categoryData.length <= 0 && (
              <div className="min-h-dvh flex justify-center items-center flex-col gap-5">
                <img src={img} alt="no products found" className="w-3/12"></img>
                <p className="font-semibold">Sorry, No products found!</p>
              </div>
            )}
          </div>
          <div>
            {categoryData.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={catTotalPages} handlePagination={handlePagination}></Pagination>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
