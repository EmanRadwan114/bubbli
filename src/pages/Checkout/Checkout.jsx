import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Coupons from "../../components/Coupons/Coupons";
import MultiCardSlider from "../../components/slider/slider";
import { useOrders } from "../../context/OrdersContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProfileData, useUpdateProfile } from "../../hooks/useUser";

export default function Checkout() {
  const { getCartItems, createOrder, getShippingPrice, checkout } = useOrders();
  const { handleCartRemoval } = useCart();
  const { data: userData, refetch } = useProfileData();
  const updateProfile = useUpdateProfile();
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCartItems] = useState([]);
  // Inside Checkout component:

  const [selectedAddress, setSelectedAddress] = useState("");

  const handleAddressSelect = (address) => {
    if (selectedAddress === address) {
      // Deselecting
      setSelectedAddress("");
      formik.setFieldValue("address", "");
    } else {
      setSelectedAddress(address);
      formik.setFieldValue("address", address);
    }
  };

  const navigate = useNavigate();
  const shippingPrice = getShippingPrice();
  const addresses = userData?.data.address || [];

  // useEffect(() => {
  //   if (userData) {
  //     console.log("userData:", userData.data);
  //     console.log("address:", userData.data.address);
  //   }
  // }, [userData]);

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

  const calculateSubtotal = () => {
    return cart.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const totalPrice = subtotal - couponDiscount + shippingPrice;

  const CheckoutSchema = Yup.object().shape({
    address: Yup.string()
      .min(3, "Address should be at least 3 characters")
      .required("Address is required"),
    paymentMethod: Yup.string().required("Payment method is required"),
  });

  const formik = useFormik({
    initialValues: {
      address: "",
      paymentMethod: "cash",
    },
    validationSchema: CheckoutSchema,
    onSubmit: async (values) => {
      const orderData = {
        shippingAddress: values.address,
        paymentMethod: values.paymentMethod,
        totalPrice,
        ...(couponCode && { couponCode }),
      };

      setLoading(true);
      try {
        // Save new address if not already saved
        if (!addresses.includes(values.address.trim())) {
          await updateProfile.mutateAsync({
            address: [...addresses, values.address.trim()],
          });
          console.log("Updated address:", [...addresses, values.address]);

          await refetch();
        }

        const res = await createOrder(orderData);
        if (values.paymentMethod === "online") {
          const { sessionId } = res.data;
          await checkout(sessionId);
        } else {
          handleCartRemoval();
          toast.success("Order placed successfully!");
          navigate(`/order-confirmation/${res.data.data._id}`);
        }
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Something went wrong, please try again!");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCouponApply = ({ couponCode, discount }) => {
    setCouponCode(couponCode);
    setCouponDiscount(discount);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen px-6 gap-4 items-start">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col gap-6 mt-6 w-full sm:w-4/5 mx-auto py-6">
        <h2 className="text-3xl font-semibold text-primary font-pacifico">
          CheckOut
        </h2>
        <div className="h-[5px] w-3/4 md:w-72 bg-gradient-to-r from-[#2d72a4] to-[#c74029] mb-2" />

        <h4 className="text-accent text-lg font-medium">Shipping Address</h4>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          {/* SAVED ADDRESSES CARDS */}
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
                    }`}>
                    <input
                      type="radio"
                      name="savedAddress"
                      value={addr}
                      checked={selectedAddress === addr}
                      onChange={() => handleAddressSelect(addr)}
                      className="mr-2 accent-teal-600 "
                    />
                    {addr}
                  </label>
                ))}
              </div>
              {selectedAddress && (
                <button
                  type="button"
                  onClick={() => handleAddressSelect(selectedAddress)}
                  className="text-sm text-red-500 underline self-start mt-1 cursor-pointer">
                  Deselect Address to enter new one
                </button>
              )}
            </div>
          )}

          {/* ADDRESS INPUT */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-accent mb-1">
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

          {/* PAYMENT METHOD */}
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-lg font-medium text-accent mb-1">
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
              onBlur={formik.handleBlur}>
              <option value="cash">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.paymentMethod}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-[0.4] bg-secondary sticky top-20 mx-auto rounded-lg p-6 flex flex-col gap-4 w-full sm:w-4/5 mt-8 mb-6 min-w-[357px]">
        <MultiCardSlider />
        <div className="border-t pt-2 border-accent">
          <Coupons onApplyCoupon={handleCouponApply} />
        </div>

        <div className="pt-2">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>EGP {subtotal}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shipping:</span>
            <span>EGP {shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Discount:</span>
            <span>EGP {couponDiscount}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-accent pt-2 mt-2">
            <h3>Total:</h3>
            <h3>EGP {totalPrice}</h3>
          </div>

          <button
            type="button"
            className="w-full text-white py-2 rounded mt-4 disabled:opacity-50 light-primary-btn"
            onClick={formik.handleSubmit}
            disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
