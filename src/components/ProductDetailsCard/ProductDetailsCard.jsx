import { Heart } from "lucide-react";
import React from "react";

const ProductDetailsCard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      {/* Left - Product Image */}
      <div className="flex justify-center items-center">
        <img
          src="https://www.marketchino.com/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/w/h/whatsapp_image_2025-05-27_at_1.13.22_pm_4_.jpeg"
          alt="Eid Said Stand"
          className="max-w-lg w-full max-h-120  rounded-lg shadow object-cover"
        />
      </div>

      {/* Right - Product Info */}
      <div>
        {/* Title */}
        <div className="flex justify-between items-start mb-2">
          {" "}
          <h2 className=" text-2xl md:text-4xl  font-semibold mb-2 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            Eid Said Stand Said Stand
          </h2>
          <button
            // onClick={() => onAddToWishlist(product._id)}
            className={` border border-gray-300 rounded-lg hover:bg-primary hover:text-white p-2 flex justify-center items-center gap-2 transition `}
            //   ${
            //   wishlistArr.includes(product._id)
            //     ? "text-red-600 border-red-600"
            //     : "text-gray-700 hover:bg-gray-100"
            // }`
          >
            <Heart className="w-6 h-6 " />

            {/* {wishlistArr.includes(product._id)
              ? "Added to Wishlist"
              : "Add to Wishlist"} */}
          </button>
        </div>

        {/* Price */}
        <p className="text-xl md:text-2xl text-[var(--color-dark)] mb-1 dark:text-[var(--color-light)]">
          LE 249.00
        </p>

        {/* Stock Status */}
        <p className=" text-green-600 mb-4">
          In stock: <span className="font-medium">5</span>
        </p>
        {/* Divider */}
        <hr className="my-4 border-gray-300" />
        {/* <p className="text-sm text-red-500 mb-4">Out of stock</p> */}

        {/* Attributes */}
        <p className="text-gray-500 mb-2">
          Category:{" "}
          <span className="text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            Stationery
          </span>
        </p>

        <p className="text-gray-500 mb-2">
          Material:{" "}
          <span className="text-[var(--color-accent)] dark:text-[var(--color-accent-dark)]">
            Ceramic
          </span>
        </p>

        <p className="text-gray-500 mb-4 flex items-center gap-2">
          Color:
          <span className="inline-block w-4 h-4 rounded-full bg-[var(--color-accent-dark)]"></span>
        </p>

        {/* Description */}
        <p className="mt-6 text-gray-600 text-sm leading-relaxed dark:text-gray-100">
          Celebrate Eid al-Adha with our festive Eid Said Stand! This playful
          decoration adds a touch of joy to your home during the holiday.
          Perfect as a centerpiece for your feast table or as a cheerful gift.
        </p>
        {/* Buy Button */}
        <button className="mt-10 w-full light-primary-btn rounded-lg py-2 mb-4 transition dark:dark-primary-btn">
          Buy it now
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
