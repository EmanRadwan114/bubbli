import React, { useEffect, useState } from "react";
import { useOrders } from "../../context/OrdersContext";

export default function MultiCardSlider() {
  const { getCartItems } = useOrders();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCartItems();
        setCartItems(res.data.data);
      } catch (err) {
        console.error("Error fetching cart items", err);
      }
    };

    fetchData();
  }, [getCartItems]);

  return (
    <div className="w-full max-w-[1000px] min-w-[330px] px-3 py-1 h-[300px] overflow-y-auto space-y-1.5">
      {cartItems.map((item, index) => (
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
              Qty: {item.quantity} x {item.productId.price}
            </p>
          </div>

          {/* Price */}
          <div className="text-primary font-bold text-base ml-4 whitespace-nowrap">
            EGP {item.quantity * item.productId.price}
          </div>
        </div>
      ))}
    </div>
  );
}
