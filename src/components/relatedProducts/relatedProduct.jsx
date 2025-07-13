import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductCard from "../../components/ProductCard/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { getAllProducts } from "../../hooks/useProducts";
import { useCart } from "../../context/CartContext";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useAllWishlist,
} from "../../hooks/useWishlist";
import { toast } from "react-toastify";

const RelatedProducts = () => {
  const { categoryName, id: currentProductId } = useParams();
  const navigate = useNavigate();
  const [page] = useState(1);

  const { data: allWishlist } = useAllWishlist();
  const wishlistArr = allWishlist?.data?.map((item) => item._id) || [];

  const { data, isLoading, isError, error } = getAllProducts(page);

  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { addToCart } = useCart();

  const currentProduct = data?.data?.find(
    (product) => product._id === currentProductId
  );

  const currentCategoryId =
    currentProduct?.categoryID?._id || currentProduct?.categoryID;

  const relatedProducts =
    data?.data?.filter(
      (product) =>
        (product.categoryID?._id || product.categoryID) === currentCategoryId &&
        product._id !== currentProductId
    ) || [];

  const handleAddToCart = (productId) => {
    addToCart(productId);
    toast.success("Product added to cart.");
  };

  const handleToggleWishlist = (productId) => {
    if (wishlistArr.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleProductClick = (categoryName, id) => {
    navigate(`/products/${categoryName}/${id}`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Error loading related products: {error?.message}
      </div>
    );

  if (!relatedProducts.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No related products found.
      </div>
    );

  return (
    <div className="w-full px-4 mt-16 text-center">
      <h2 className="text-3xl font-bold text-primary mb-10">Related Products</h2>

      <div className="max-w-screen-xl mx-auto">
        <Swiper
          className="related-swiper"
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          style={{
            paddingBottom: "50px",
          }}
        >
          {relatedProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <div className="flex justify-center h-full px-2">
                <ProductCard
                  product={product}
                  wishlistArr={wishlistArr}
                  onAddToCart={() => handleAddToCart(product._id)}
                  onAddToWishlist={() => handleToggleWishlist(product._id)}
                  onProductClick={() =>
                    handleProductClick(product.categoryID?.name, product._id)
                  }
                  className="w-full max-w-[280px] mx-auto" // Full width within max constraints
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .related-swiper .swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          bottom: 0px !important;
          padding-top: 10px;
        }

        .related-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #999;
          opacity: 0.6;
          transition: all 0.3s ease;
          border-radius: 50%;
        }

        .related-swiper .swiper-pagination-bullet-active {
          background-color: #222;
          opacity: 1;
          width: 10px;
          height: 10px;
        }

        .related-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;