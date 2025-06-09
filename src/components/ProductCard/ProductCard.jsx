import { Heart, Star } from "lucide-react";
import { Link } from "react-router";

const ProductCard = ({ product, wishlistArr, onAddToCart, onAddToWishlist }) => {
  return (
    <div className="light-main-bg dark-main-bg rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full dark-shadow">
      {/* Image with badges */}
      <div className="relative flex-shrink-0">
        <Link to={`/gifts/${product._id}`}>
          <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 text-center min-w-[80px]">
          {product.label.includes("new") && (
            <span
              className="bg-[#4b9cad]  text-white/95 text-sm px-2 py-1 rounded-full capitalize 
           hover:opacity-90 transition-all shadow-sm"
            >
              New
            </span>
          )}
          {product.label.includes("bestseller") && (
            <span
              className="bg-[#d46a4e]  text-white/95 text-sm px-2 py-1 rounded-full capitalize 
           hover:opacity-90 transition-all shadow-sm"
            >
              Bestseller
            </span>
          )}
          {product.label.includes("limited") && (
            <span
              className="bg-[#8a6bac]  text-white/95 text-sm px-2 py-1 rounded-full capitalize 
           hover:opacity-90 transition-all shadow-sm"
            >
              Limited
            </span>
          )}
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1 text-center min-w-[80px]">
          {product.label.includes("deal") && (
            <span
              className="bg-[#d99a5a]  text-white/95 text-sm px-2 py-1 rounded-full capitalize 
           hover:opacity-90 transition-all shadow-sm"
            >
              Deal
            </span>
          )}
          {product.label.includes("hot") && (
            <span
              className="bg-[#c76a7f]  text-white/95 text-sm px-2 py-1 rounded-full capitalize 
           hover:opacity-90 transition-all shadow-sm"
            >
              Hot
            </span>
          )}
        </div>
      </div>

      {/* Product details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/gifts/${product._id}`} className=" no-underline w-9/12">
            <h3 className="font-semibold text-xl mb-1 hover:text-accent dark:hover:text-accent-dark transition-colors">{product.title}</h3>
          </Link>
          <button onClick={() => onAddToWishlist(product._id)} className={`text-gray-500 cursor-pointer w-3/12 pt-1 `} aria-label="Add to wishlist">
            <Heart
              className={`block ms-auto w-7 h-7 ${
                wishlistArr.includes(product._id)
                  ? "text-primary fill-primary dark:text-primary-dark dark:fill-primary-dark"
                  : "hover:text-accent dark:hover:text-accent-dark transition-colors"
              }`}
            />
          </button>
        </div>
        <p className="text-dark dark:text-[#bfbfc1] mb-3">{product.description.slice(0, 100) + "..."}</p>

        {/* Rating */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start">
            {[...Array(5)].map((_, i) => {
              const isFull = i + 1 <= product.rating;
              const isHalf = i + 0.5 === product.rating;

              return (
                <div key={i} className="relative w-6 h-6">
                  {/* Empty Star Outline */}
                  <Star className="w-5 h-5 text-yellow-500 fill-none" />

                  {/* Full or Half Star Fill */}
                  {(isFull || isHalf) && (
                    <Star className={`w-5 h-5 text-yellow-500 fill-yellow-500 absolute top-0 left-0 ${isHalf ? "clip-half" : ""}`} />
                  )}
                </div>
              );
            })}
            <span className="text-gray-400 ms-1">({product.rating})</span>
          </div>

          <span className="ms-1 text-lg font-semibold hidden sm:inline">{product.totalReviews} Reviews</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex justify-between items-start gap-3 mb-2">
            {product.discount && (
              <div className="flex items-start gap-3 mb-2">
                <span className="text-gray-400 text-lg line-through">EGP {product.price}</span>

                <span className="text-gray-400 font-bold hidden sm:inline">(discount {product.discount}%)</span>
              </div>
            )}
            <span className="font-semibold text-lg">EGP {product.price - ((product.discount ? product.discount : 0) * product.price) / 100}</span>
          </div>

          {/* Actions */}
          <button
            onClick={onAddToCart}
            className="light-primary-btn dark-primary-btn text-white px-4 py-2 rounded-lg font-semibold text-lg transition-colors block w-full"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
