import { Heart, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ProductCard = ({
  product = {},
  wishlistArr = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
}) => {
  const { categoryName } = useParams();

  // Safely get product properties with defaults
  const {
    _id = "",
    thumbnail = "",
    title = "",
    description = "",
    price = 0,
    discount = 0,
    avgRating = 0,
    numberOfReviews = 0,
    label = [],
  } = product;

  // Create product link safely
  const productLink = _id
    ? categoryName
      ? `/gifts/${categoryName}/${_id}`
      : `/gifts/product/${_id}`
    : "#";

  // Helper function to check labels safely
  const hasLabel = (labelType) => {
    return Array.isArray(label) && label.includes(labelType);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="light-main-bg dark-main-bg rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full dark-shadow">
      {/* Image with badges */}
      <div className="relative flex-shrink-0">
        <Link to={productLink}>
          <img
            src={thumbnail || "/placeholder-image.jpg"}
            alt={title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Badges - with safe checks */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 text-center min-w-[80px]">
          {hasLabel("new") && (
            <span className="bg-[#4b9cad] text-white/95 text-sm px-2 py-1 rounded-full capitalize hover:opacity-90 transition-all shadow-sm">
              New
            </span>
          )}
          {hasLabel("bestseller") && (
            <span className="bg-[#d46a4e] text-white/95 text-sm px-2 py-1 rounded-full capitalize hover:opacity-90 transition-all shadow-sm">
              Bestseller
            </span>
          )}
          {hasLabel("limited") && (
            <span className="bg-[#8a6bac] text-white/95 text-sm px-2 py-1 rounded-full capitalize hover:opacity-90 transition-all shadow-sm">
              Limited
            </span>
          )}
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1 text-center min-w-[80px]">
          {hasLabel("deal") && (
            <span className="bg-[#d99a5a] text-white/95 text-sm px-2 py-1 rounded-full capitalize hover:opacity-90 transition-all shadow-sm">
              Deal
            </span>
          )}
          {hasLabel("hot") && (
            <span className="bg-[#c76a7f] text-white/95 text-sm px-2 py-1 rounded-full capitalize hover:opacity-90 transition-all shadow-sm">
              Hot
            </span>
          )}
        </div>
      </div>

      {/* Product details */}
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <Link to={productLink} className="no-underline w-9/12">
            <h3 className="font-semibold text-lg mb-1 hover:text-accent dark:hover:text-accent-dark transition-colors">
              {title}
            </h3>
          </Link>
          <button
            onClick={() => _id && onAddToWishlist(_id)}
            className="text-gray-500 cursor-pointer w-3/12 pt-1"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`block ms-auto w-7 h-7 ${
                Array.isArray(wishlistArr) && wishlistArr.includes(_id)
                  ? "text-primary fill-primary dark:text-primary-dark dark:fill-primary-dark"
                  : "hover:text-accent dark:hover:text-accent-dark transition-colors"
              }`}
            />
          </button>
        </div>

        <p className="text-dark dark:text-[#bfbfc1] mb-3">
          {description
            ? `${description.slice(0, 100)}...`
            : "No description available"}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
              const isFull = i + 1 <= (avgRating || 0);
              const isHalf = i + 0.5 === (avgRating || 0);

              return (
                <div key={i} className="relative w-4 h-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-none" />
                  {(isFull || isHalf) && (
                    <Star
                      className={`w-4 h-4 text-yellow-500 fill-yellow-500 absolute top-0 left-0 ${
                        isHalf ? "clip-half" : ""
                      }`}
                    />
                  )}
                </div>
              );
            })}
            <span className="text-gray-400 ms-1">({avgRating || 0})</span>
          </div>

          <span className="ms-1 font-semibold hidden sm:inline">
            {numberOfReviews === 1
              ? "1 review"
              : `${numberOfReviews || 0} reviews`}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-start gap-3 mb-2">
          {discount > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-gray-400 line-through">EGP {price}</span>
              <span className="text-gray-400 font-bold hidden sm:inline">
                ({discount}% off)
              </span>
            </div>
          )}
          <span className="font-semibold">
            EGP {price - (discount * price) / 100}
          </span>
        </div>

        {/* Button */}
        <div className="mt-auto">
          {user?.role !== "admin" && (
            <button
              onClick={() => {
                onAddToCart(product._id);
              }}
              className="light-primary-btn dark-primary-btn text-white px-4 py-1.5 rounded-lg font-semibold transition-colors block w-full"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
