import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { applyCoupon } from "../../services/couponService";

export default function Coupons({ onApplyCoupon }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", success: null });

  const CouponSchema = Yup.object().shape({
    coupon: Yup.string().min(3, "Coupon should be at least 3 characters"),
  });

  const formik = useFormik({
    initialValues: {
      coupon: "",
    },
    validationSchema: CouponSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        setFeedback({ message: "", success: null });

        const response = await applyCoupon({ couponCode: values.coupon });

        if (onApplyCoupon) {
          onApplyCoupon({
            couponCode: values.coupon,
            discount: response.discount,
          });
        }

        setFeedback({
          message: response.message || "Coupon applied successfully!",
          success: true,
        });

        resetForm();
      } catch (error) {
        setFeedback({
          message: error.response?.data.message || "Invalid coupon",
          success: false,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full flex flex-col gap-2">
      <label
        htmlFor="coupon"
        className="block text-sm font-medium text-primary mb-1">
        Coupon Code
      </label>
      <div className="relative w-full">
        <input
          id="coupon"
          name="coupon"
          type="text"
          value={values.coupon}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your coupon"
          className={`w-full border-2 rounded px-4 py-3 text-base focus:outline-none ${
            touched.coupon && errors.coupon
              ? "border-red-500"
              : "border-primary"
          } focus:ring-2 focus:ring-primary pr-32`}
        />

        <button
          type="submit"
          disabled={loading}
          className="absolute top-0 right-0 h-[51px] px-5 bg-primary text-white text-sm font-semibold rounded shadow hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            "Apply"
          )}
        </button>

        {touched.coupon && errors.coupon && (
          <p className="text-red-500 text-sm mt-1">{errors.coupon}</p>
        )}
      </div>

      {feedback.message && (
        <div
          className={`border-l-4 p-4 rounded ${
            feedback.success
              ? "bg-green-100 border-green-500 text-green-700"
              : "bg-red-100 border-red-500 text-red-700"
          }`}>
          {feedback.message}
        </div>
      )}
    </form>
  );
}
