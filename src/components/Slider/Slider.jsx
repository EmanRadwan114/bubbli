import React from "react";
import { useOrders } from "../../hooks/useOrders";

export default function MultiCardSlider() {
  const { cartData, isCartLoading, isCartError } = useOrders();

  // Extract items from query result
  const cartItems = cartData?.data?.data || [];

  if (isCartLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-accent">Loading cart items...</p>
      </div>
    );
  }

  if (isCartError) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-red-500">Error loading cart items</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] md:min-w-[330px] px-3 py-1 h-[300px] overflow-y-auto space-y-1.5">
      {cartItems.length === 0 ? (
        <p className="text-center text-accent">Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => {
          const price = item.productId.price;
          const discount = item.productId.discount || 0;
          const discountedPrice = price * (1 - discount / 100);

          return (
            <div
              key={item._id || index}
              className="flex items-center bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-2">
              {/* Image */}
              <img
                src={item.productId.thumbnail}
                alt={item.productId.title}
                className="w-[60px] h-[60px] object-cover rounded-lg bg-cardAlt mr-4"
              />

              {/* Title & Quantity */}
              <div className="flex flex-col justify-center flex-grow">
                <h3 className="text-primary font-bold text-lg mb-1">
                  {item.productId.title}
                </h3>
                <p className="text-accent font-semibold text-sm">
                  Qty: {item.quantity} x EGP {discountedPrice.toFixed(2)}
                </p>
              </div>

              {/* Total Price */}
              <div className="text-primary font-bold text-base ml-4 whitespace-nowrap">
                EGP {(item.quantity * discountedPrice).toFixed(2)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
