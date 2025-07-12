import React, { useEffect, useMemo, useRef, useState } from "react";
import { Gift, Heart, ChevronUp, ChevronDown, Star } from "lucide-react";
import { useParams } from "react-router";
import { useGetProductById } from "../../hooks/useProducts";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { WishlistContext } from "../../context/Wishlist.Context";
import {
  useAddToWishlist,
  useAllWishlist,
  useRemoveFromWishlist,
} from "../../hooks/useWishlist";
import { useAddToCart } from "../../hooks/useCart";

const ProductDetailsCard = () => {
  const { categoryName, id } = useParams();

  // Fetch product data
  const { data: response, isLoading, isError, error } = useGetProductById(id);
  const product = response?.data?.[0];

  // State for image gallery
  const [mainImage, setMainImage] = useState(null);
  const thumbRef = useRef();

  // create mergedImages Array which includes images & thmubnail
  const mergedImages = useMemo(() => {
    const images = Array.isArray(product?.images) ? product.images : [];
    const allImages = product?.thumbnail
      ? [product.thumbnail, ...images]
      : images;
    return [...new Set(allImages)];
  }, [product]);

  useEffect(() => {
    if (mergedImages.length > 0) {
      setMainImage(mergedImages[0]);
    }
  }, [mergedImages]);

  const scrollThumbnails = (direction) => {
    if (!thumbRef.current) return;
    const scrollAmount = 100;
    thumbRef.current.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const {
    data: allWishlist,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
    error: wishlistError,
  } = useAllWishlist();

  const wishlistArr = allWishlist?.data?.map((item) => item._id) || [];
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const {
    mutateAsync: addProToCart,
    isPending: pendingAddToCart,
    isSuccess: addToCartSuccess,
  } = useAddToCart();

  const onAddToCart = async (id) => {
    await addProToCart(id);
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading product: {error.message}
      </div>
    );
  }
  // No product found
  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }
  // Check if product is in wishlist
  const isInWishlist = product?._id ? wishlistArr.includes(product._id) : false;

  const handleWishlistClick = () => {
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 lg:px-16 pt-10">
      {/* Left Section - Images */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnails with arrows */}
        <div className="flex items-center sm:flex-col sm:max-h-[480px] max-w-full overflow-x-auto sm:overflow-y-auto scrollbar-hide h-full">
          {/* Up Arrow */}
          {mergedImages.length > 5 && (
            <button
              onClick={() => scrollThumbnails("up")}
              className="hidden sm:block mb-2 p-1 light-primary-btn dark:dark-primary-btn rounded shadow"
            >
              <ChevronUp size={18} />
            </button>
          )}

          <div
            ref={thumbRef}
            className="flex sm:flex-col  gap-2 max-w-full h-full overflow-x-auto sm:overflow-y-hidden scrollbar-hide"
          >
            {mergedImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 rounded-md border-2 object-cover cursor-pointer mx-1 sm:mx-0 sm:my-1 ${
                  mainImage === img ? "border-amber-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Down Arrow */}
          {mergedImages.length > 5 && (
            <button
              onClick={() => scrollThumbnails("down")}
              className="hidden sm:block mt-2 p-1 light-primary-btn dark:dark-primary-btn rounded shadow"
            >
              <ChevronDown size={18} />
            </button>
          )}
        </div>

        {/* Main Image */}
        <div className="relative w-full">
          <img
            src={mainImage}
            alt="Main product"
            className="w-full max-h-[480px] object-cover rounded-lg shadow"
          />
          {product.label?.includes("deal") && (
            <span className="absolute text-lg top-2 right-2 bg-[#5ad980] text-white px-4 py-1 rounded-full shadow">
              Deal
            </span>
          )}
        </div>
      </div>

      {/* Right Section - Info */}
      <div className="flex flex-col justify-between px-4">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            {product.title}
          </h1>
          <button
            onClick={handleWishlistClick}
            className={`border rounded-lg p-2 transition ${
              isInWishlist
                ? "bg-primary text-white border-primary"
                : "border-gray-300 hover:bg-primary hover:text-white"
            }`}
          >
            <Heart
              className="w-7 h-7"
              fill={isInWishlist ? "currentColor" : "none"}
            />
          </button>
        </div>
        {/* Rating */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start">
            {[...Array(5)].map((_, i) => {
              const isFull = i + 1 <= Math.floor(product.avgRating);
              const isHalf = i + 0.5 === Math.floor(product.avgRating);

              return (
                <div key={i} className="relative w-7 h-7 mr-1">
                  {/* Empty Star Outline */}
                  <Star className="w-7 h-7 text-yellow-500 fill-none" />

                  {/* Full or Half Star Fill */}
                  {(isFull || isHalf) && (
                    <Star
                      className={`w-7 h-7 text-yellow-500 fill-yellow-500 absolute top-0 left-0 ${
                        isHalf ? "clip-half" : ""
                      }`}
                    />
                  )}
                </div>
              );
            })}
            <p className="text-gray-400 text-lg mx-2 ">{product.avgRating}</p>
            <p className="ms-1 text-lg  hidden sm:inline">
              ({product.numberOfReviews} Reviews)
            </p>
          </div>
        </div>
        <p className="text-xl font-semibold text-[var(--color-dark)] dark:text-[var(--color-light)] mb-1">
          LE {product.price - (product.price * product.discount) / 100}
          {product.discount > 0 && (
            <span className="text-gray-500 line-through ml-2">
              LE {product.price}
            </span>
          )}
        </p>
        <p className="text-green-600 mb-3">
          In stock: <span className="font-medium">{product.stock}</span>
        </p>

        <hr className="my-4 border-gray-300" />

        <p className="text-gray-700 mb-1 dark:text-gray-400">
          Category:{" "}
          <span className="font-medium text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            {categoryName}
          </span>
        </p>
        <p className="text-gray-700 mb-1 dark:text-gray-400">
          Material:{" "}
          <span className="font-medium text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            {product.material}
          </span>
        </p>
        <p className="text-gray-700 dark:text-gray-400 mb-4 flex items-center gap-2">
          Color:{" "}
          {product.color?.split("&").map((clr, idx) => (
            <span
              key={idx}
              className="w-5 h-5 rounded-full  border-1 inline-block"
              style={{ backgroundColor: clr.toLowerCase() }}
              title={clr.trim()}
            />
          ))}
          <span className="capitalize">{product.color}</span>
        </p>

        <p className="text-gray-800 dark:text-gray-100 leading-relaxed mb-6">
          {product.description}
        </p>

        <button
          className="flex items-center justify-center gap-3 w-full py-2 text-lg font-medium rounded-lg light-primary-btn dark:dark-primary-btn"
          onClick={() => onAddToCart(product._id)}
        >
          <Gift />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
