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
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  const navigate = useNavigate();
  const shippingPrice = getShippingPrice();
  const addresses = userData?.address || [];

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
        if (!addresses.includes(values.address)) {
          await updateProfile.mutateAsync({
            addresses: [...addresses, values.address],
          });
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

  const handleAddressSelect = (address) => {
    formik.setFieldValue("address", address);
    setEditingAddressIndex(null);
  };

  const handleAddressEdit = (index) => {
    formik.setFieldValue("address", addresses[index]);
    setEditingAddressIndex(index);
  };

  const handleAddressRemove = async (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    try {
      await updateProfile.mutateAsync({ addresses: newAddresses });
      await refetch();
      toast.success("Address removed.");
    } catch {
      toast.error("Failed to remove address.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen px-6 gap-4 items-start">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col gap-6 mt-6 w-full sm:w-4/5 mx-auto py-6">
        <h2 className="text-3xl font-semibold text-primary font-pacifico">
          CheckOut
        </h2>
        <div className="h-[5px] w-3/4 md:w-72 bg-gradient-to-r from-[#2d72a4] to-[#c74029] mb-2" />

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-6 mt-4">
          {/* EXISTING ADDRESSES */}
          {addresses.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-accent text-sm font-medium">
                Saved Addresses:
              </h4>
              {addresses.map((addr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-sm text-blue-600 underline"
                    onClick={() => handleAddressSelect(addr)}>
                    {addr}
                  </button>
                  <button
                    type="button"
                    className="text-xs text-yellow-600"
                    onClick={() => handleAddressEdit(index)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => handleAddressRemove(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ADDRESS INPUT */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-accent mb-1">
              Shipping Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className={`w-full px-4 py-2 rounded border ${
                formik.touched.address && formik.errors.address
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
              className="block text-sm font-medium text-accent mb-1">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className={`w-full px-4 py-2 rounded border ${
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
