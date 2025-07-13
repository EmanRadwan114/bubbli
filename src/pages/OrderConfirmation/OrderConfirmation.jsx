import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrders";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const OrderConfirmation = () => {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading)
    return (
      <div className="text-center py-8 text-accent dark:text-accent-dark">
        <LoadingSpinner/>
      </div>
    );
  if (isError || !order)
    return (
      <div className="text-center py-8 text-primary dark:text-primary-dark">
        Failed to load order data.
      </div>
    );

  const {
    _id,
    totalPriceBeforeDiscount,
    totalPriceAfterDiscount,
    totalPrice,
    shippingPrice,
    paymentMethod,
    shippingAddress,
    shippingStatus,
    phone,
    createdAt,
    orderItems,
  } = order;

  // Responsive breakpoints for the slider
  const sliderBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  };

  return (
    <div className="light-main-bg dark-main-bg max-w-4xl mx-auto p-4 sm:p-6 md:p-8 rounded-lg shadow-md dark:shadow-none dark:border dark:border-accent-dark">
      <div className="text-center mb-8">
        <div className="inline-block bg-primary/10 dark:bg-primary-dark/20 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-primary dark:text-primary-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-dark mb-2">
          Order Confirmed!
        </h1>
        <p className="text-dark/80 dark:text-light/80 text-sm sm:text-base">
          Thank you for your purchase!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Order Summary */}
        <div className="bg-card dark:bg-secondary-dark p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-accent dark:text-accent-dark mb-3 sm:mb-4 pb-2 border-b border-cardAlt dark:border-secondary">
            Order Summary
          </h2>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <p>
              <span className="font-medium text-dark dark:text-light">
                Status:
              </span>{" "}
              <span className="capitalize">{shippingStatus}</span>
            </p>
            <p>
              <span className="font-medium text-dark dark:text-light">
                Date:
              </span>{" "}
              {new Date(createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-dark dark:text-light">
                Payment Method:
              </span>{" "}
              <span className="capitalize">{paymentMethod}</span>
            </p>
          </div>
        </div>
        {/* Shipping & Payment */}
        <div className="bg-card dark:bg-secondary-dark p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-accent dark:text-accent-dark mb-3 sm:mb-4 pb-2 border-b border-cardAlt dark:border-secondary">
            Shipping Information
          </h2>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <p>
              <span className="font-medium text-dark dark:text-light">
                Address:
              </span>{" "}
              {shippingAddress}
            </p>
            <p>
              <span className="font-medium text-dark dark:text-light">
                Shipping:
              </span>{" "}
              {shippingPrice} EGP
            </p>
            <p>
              <span className="font-medium text-dark dark:text-light">
                Phone:
              </span>{" "}
              {phone}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items Slider */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-accent dark:text-accent-dark mb-3 sm:mb-4 pb-2 border-b border-cardAlt dark:border-secondary">
          Order Items ({orderItems?.length || 0})
        </h2>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={sliderBreakpoints}
          navigation
          // pagination={{ clickable: true }}
          className="order-items-slider"
        >
          {Array.isArray(orderItems) &&
            orderItems.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="flex flex-col h-full p-4 bg-cardAlt/50 dark:bg-secondary-dark/70 rounded-lg">
                  <img
                    src={item.product?.thumbnail}
                    alt={item.product?.title}
                    className="w-full h-40 object-contain rounded border border-cardAlt dark:border-secondary mb-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-dark dark:text-light text-sm sm:text-base mb-2 line-clamp-2">
                      {item.product?.title}
                    </h3>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-dark/80 dark:text-light/80 text-sm">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-primary dark:text-primary-dark font-medium">
                        {item.product?.price} EGP
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Price Summary */}
      <div className="bg-card dark:bg-secondary-dark p-4 sm:p-6 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-accent dark:text-accent-dark mb-3 sm:mb-4 pb-2 border-b border-cardAlt dark:border-secondary">
          Price Summary
        </h2>
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-dark dark:text-light">Subtotal:</span>
            <span>{totalPriceBeforeDiscount} EGP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark dark:text-light">Discount:</span>
            {totalPriceBeforeDiscount && totalPriceAfterDiscount && (
              <span>
                -
                {Math.abs(
                  totalPriceBeforeDiscount - totalPriceAfterDiscount
                ).toFixed(2)}{" "}
                EGP
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-dark dark:text-light">Shipping:</span>
            <span>{shippingPrice} EGP</span>
          </div>
          <div className="flex justify-between pt-2 sm:pt-3 border-t border-cardAlt dark:border-secondary font-bold text-base sm:text-lg">
            <span className="text-dark dark:text-light">Total:</span>
            <span className="text-primary dark:text-primary-dark">
              {totalPrice} EGP
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center text-dark/70 dark:text-light/70 text-xs sm:text-sm">
        <p>
          Thank you for shopping with us! We'll notify you when your order
          ships.
        </p>
        <Link
          to="/gifts"
          className="inline-block bg-primary text-white font-semibold px-6 py-2 rounded mt-6 hover:bg-primary-dark transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
