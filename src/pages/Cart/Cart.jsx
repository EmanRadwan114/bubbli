import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import emptyCartImage from "../../assets/images/emptyCart.svg";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Pagination from "./../../components/Pagination/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";

export default function Cart() {
  const navigate = useNavigate();

  const {
    data,
    page,
    setPage,
    isLoading,
    handleCartRemoval,
    handleQuantity,
    refetch,
    setCartItems,
  } = useCart();

  function handlePagination(value) {
    setPage(value);
  }

  const calculateTotal = () => {
    const subtotal = data?.subtotal || 0;
    const shipping = 50;
    return subtotal + shipping;
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setCartItems(data?.totalItems);
  }, [data]);

  return (
    <>
      <Breadcrumb />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="min-h-screen">
            <LoadingSpinner />;
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Your Shopping Cart ({data?.totalItems || 0} Products)
                </h1>
                <button
                  className="light-primary-btn dark-primary-btn px-4 py-2 rounded-sm block ms-auto"
                  onClick={() => handleCartRemoval()}
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {data.data.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                  >
                    <img
                      src={item.productId.thumbnail}
                      alt={item.productId.title}
                      className="w-full sm:w-32 h-32 object-contain rounded-lg bg-gray-50 dark:bg-gray-700 p-2"
                    />

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.productId.title}
                        </h3>
                        <button
                          onClick={() => handleCartRemoval(item.productId._id)}
                          className="text-gray-400 hover:text-primary-500 p-1 dark:hover:text-primary-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md">
                          <button
                            onClick={() =>
                              handleQuantity(
                                item.productId._id,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 text-center w-10">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantity(
                                item.productId._id,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-gray-500 dark:text-gray-400 ">
                            EGP {item.productId.price}.00 each
                          </p>
                          <p className="font-semibold text-primary dark:text-primary-dark">
                            EGP{" "}
                            {(item.productId.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={data?.totalPages}
                handlePagination={handlePagination}
                className="mt-8"
              />
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-1/3">
              <div className="sticky top-20 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      EGP {data?.subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Shipping
                    </span>
                    <span className="font-medium">EGP 50.00</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary dark:text-primary-dark">
                      EGP {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white py-3 px-4 rounded-md font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={emptyCartImage}
              alt="Empty Cart"
              className="w-64 h-64 object-contain mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md text-center">
              Looks like you haven't added anything to your cart yet. Start
              shopping to discover amazing products!
            </p>
            <button
              onClick={() => navigate("/gifts")}
              className="bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white py-2 px-6 rounded-md font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
