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
import { useCategories } from "../../hooks/useCategories";
import { toast } from "react-toastify";

const RelatedProducts = () => {
  const { categoryName, id: currentProductId } = useParams();
  const navigate = useNavigate();
  const [page] = useState(1);

  const { data: allWishlist } = useAllWishlist();
  const wishlistArr = allWishlist?.data?.map((item) => item._id) || [];

  const { data, isLoading, isError, error } = getAllProducts(page);
  const { data: categoryResponse = {} } = useCategories();
  const categories = categoryResponse.data || [];

  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { addToCart } = useCart();

  const currentProduct = data?.data?.find(
    (product) => product._id === currentProductId
  );
  const currentCategoryName = categories.find(
    (c) => c._id === currentProduct?.categoryID
  )?.name;

  const relatedProducts =
    data?.data?.filter((product) => {
      const productCategoryName = categories.find(
        (c) => c._id === product.categoryID
      )?.name;
      return (
        product._id !== currentProductId &&
        productCategoryName === currentCategoryName
      );
    }) || [];

  const handleAddToCart = (productId) => {
    addToCart(productId);
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
    <div className="w-full px-4 mt-16 relative">
      <h2 className="text-3xl font-bold text-primary mb-10 text-center">
        Related Products
      </h2>

      <div className="max-w-screen-xl mx-auto relative">
        {/* Navigation arrows container */}
        <div className="absolute inset-y-0 left-0 z-10 flex items-center -ml-4">
          <button className="related-swiper-prev bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 z-10 flex items-center -mr-4">
          <button className="related-swiper-next bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <Swiper
          className="related-swiper"
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: ".related-swiper-prev",
            nextEl: ".related-swiper-next",
          }}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
            // 1280: { slidesPerView: 3 },
          }}
          style={{
            padding: "0 40px 50px", // Added side padding for arrow space
          }}
        >
          {relatedProducts.map((product) => {
            const productCategoryName =
              categories.find((c) => c._id === product.categoryID)?.name ||
              "unknown";

            return (
              <SwiperSlide key={product._id}>
                <div className="flex justify-center h-full px-2">
                  <ProductCard
                    product={product}
                    wishlistArr={wishlistArr}
                    onAddToCart={() => handleAddToCart(product._id)}
                    onAddToWishlist={() => handleToggleWishlist(product._id)}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <style jsx>{`
        .related-swiper .swiper-pagination {
          margin: 20px;
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
          padding: 10px 0; /* Add vertical padding */
        }

        /* Custom navigation buttons */
        .related-swiper-prev,
        .related-swiper-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          cursor: pointer;
        }

        .related-swiper-prev {
          left: 0;
        }

        .related-swiper-next {
          right: 0;
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;
