import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Coupons from "../../components/Coupons/Coupons";
import MultiCardSlider from "../../components/Slider/Slider.jsx";
import { useOrders } from "../../hooks/useOrders";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProfileData, useUpdateProfile } from "../../hooks/useUser";

export default function Checkout() {
  const {
    cartData,
    isCartLoading,
    createOrder,
    isCreatingOrder,
    getShippingPrice,
    checkout,
  } = useOrders();

  const { handleCartRemoval } = useCart();
  const { data: userData, refetch } = useProfileData();
  const updateProfile = useUpdateProfile();

  const navigate = useNavigate();

  const addresses = userData?.data.address || [];
  const shippingPrice = getShippingPrice();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscountPct, setCouponDiscountPct] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from React Query
  useEffect(() => {
    if (cartData?.data?.data) {
      setCartItems(cartData.data.data);
    }
  }, [cartData]);

  // Estimate subtotal (including per-product discounts)
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.productId.price;
      const discount = item.productId.discount || 0;
      const discountedPrice = price * (1 - discount / 100);
      return acc + discountedPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const couponDiscountAmount = subtotal * (couponDiscountPct / 100);
  const totalPrice = Math.max(
    0,
    subtotal - couponDiscountAmount + shippingPrice
  );

  const handleAddressSelect = (address) => {
    if (selectedAddress === address) {
      setSelectedAddress("");
      formik.setFieldValue("address", "");
    } else {
      setSelectedAddress(address);
      formik.setFieldValue("address", address);
    }
  };

  const CheckoutSchema = Yup.object().shape({
    address: Yup.string()
      .min(3, "Address should be at least 3 characters")
      .required("Address is required"),
    phone: Yup.string()
      .matches(/^01[0-2,5]{1}[0-9]{8}$/, "Enter a valid Egyptian phone number")
      .required("Phone is required"),
    paymentMethod: Yup.string().required("Payment method is required"),
  });

  const formik = useFormik({
    initialValues: {
      address: "",
      phone: "",
      paymentMethod: "cash",
    },
    validationSchema: CheckoutSchema,
    onSubmit: async (values) => {
      if (!values.address.trim()) {
        toast.error("Please enter a valid shipping address.");
        return;
      }

      try {
        const orderData = {
          shippingAddress: values.address.trim(),
          phone: values.phone.trim(),
          paymentMethod: values.paymentMethod,
          ...(couponCode && { couponCode }),
        };

        console.log("Sending orderData:", orderData);

        // Address save
        if (!addresses.includes(values.address.trim())) {
          await updateProfile.mutateAsync({
            address: [...addresses, values.address.trim()],
          });
          await refetch();
        }

        const res = await createOrder(orderData);

        if (values.paymentMethod === "online") {
          const { iframeUrl } = res.data;
          await checkout(iframeUrl);
        } else {
          handleCartRemoval();
          toast.success("Order placed successfully!");
          navigate(`/order-confirmation/${res.data.data._id}`);
        }
      } catch (error) {
        console.error("Error placing order:", error?.response?.data);

        // console.error("Error placing order:", error);
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong. Please try again!"
        );
      }
    },
  });

  const handleCouponApply = ({ couponCode, discount }) => {
    setCouponCode(couponCode);
    setCouponDiscountPct(discount);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col lg:flex-row min-h-screen px-6 gap-4 items-start"
    >
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col gap-6 mt-6 w-full sm:w-4/5 mx-auto py-6">
        <h2 className="text-3xl font-semibold text-primary font-pacifico">
          CheckOut
        </h2>
        <div className="h-[5px] w-3/4 md:w-72 bg-gradient-to-r from-[#2d72a4] to-[#c74029] mb-2" />

        <h4 className="text-accent text-lg font-medium">Shipping Address</h4>

        <div className="flex flex-col gap-6">
          {addresses.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-accent text-sm font-medium">
                Saved Addresses:
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((addr, index) => (
                  <label
                    key={index}
                    className={`p-3 border rounded cursor-pointer transition ${
                      selectedAddress === addr
                        ? "border-teal-500 bg-teal-500/10"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      value={addr}
                      checked={selectedAddress === addr}
                      onChange={() => handleAddressSelect(addr)}
                      className="mr-2 accent-teal-600"
                    />
                    {addr}
                  </label>
                ))}
              </div>
              {selectedAddress && (
                <button
                  type="button"
                  onClick={() => handleAddressSelect(selectedAddress)}
                  className="text-sm text-red-500 underline self-start mt-1 cursor-pointer"
                >
                  Deselect Address to enter new one
                </button>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-accent mb-1"
            >
              Enter New Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className={`w-full px-4 py-2 rounded border-2 focus:border-teal-500 focus:outline-none ${
                formik.touched.address && formik.errors.address
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!!selectedAddress}
              placeholder={
                selectedAddress ? "Using saved address" : "Enter new address"
              }
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.address}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-lg font-medium text-accent mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className={`w-full px-4 py-2 rounded border-2 focus:border-teal-500 focus:outline-none ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. 01012345678"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-lg font-medium text-accent mb-1"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className={`w-full px-4 py-2 rounded border-2 cursor-pointer focus:border-teal-500 focus:outline-none ${
                formik.touched.paymentMethod && formik.errors.paymentMethod
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.paymentMethod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="cash">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.paymentMethod}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-[0.4] bg-secondary dark:bg-secondary-dark sticky top-20 mx-auto rounded-lg px-5 py-6 flex flex-col gap-4 w-full sm:w-4/5 mt-8 mb-6 md:min-w-[365px]">
        <MultiCardSlider />
        <div className="border-t pt-2 border-accent">
          <Coupons onApplyCoupon={handleCouponApply} />
        </div>

        <div className="pt-2">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>EGP {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shipping:</span>
            <span>EGP {shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Discount:</span>
            <span>
              EGP {couponDiscountPct ? "-" : ""}
              {couponDiscountAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-semibold border-t border-accent pt-2 mt-2">
            <h3>Total:</h3>
            <h3>EGP {totalPrice.toFixed(2)}</h3>
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 rounded mt-4 disabled:opacity-50 light-primary-btn"
            disabled={isCreatingOrder || isCartLoading}
          >
            {isCreatingOrder ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </form>
  );
}
