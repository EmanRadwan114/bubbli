import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useAddCoupon,
  useUpdateCoupon,
  useGetCouponById,
} from "../../../hooks/useCoupons";
import { toast } from "react-toastify";
import { X } from "lucide-react";

// Define what fields are allowed for add / update
const ALLOWED_FIELDS = [
  "CouponCode",
  "CouponPercentage",
  "expirationDate",
  "maxUsageLimit",
  "isActive",
];

export default function CouponsModal({
  activeModal,
  couponId,
  onClose,
  onRefresh,
}) {
  const isAdd = activeModal === "add";
  const isUpdate = activeModal === "update";
  const isView = activeModal === "getById";

  const addCoupon = useAddCoupon();
  const updateCoupon = useUpdateCoupon();
  const { data: fetchedData, isLoading } = useGetCouponById(couponId);

  // Local form data state
  const [formData, setFormData] = useState({
    CouponCode: "",
    CouponPercentage: "",
    expirationDate: "",
    maxUsageLimit: "",
    isActive: false,
  });

  // Watch API data and modal type to set form data
  useEffect(() => {
    if ((isUpdate || isView) && fetchedData) {
      const data = fetchedData;
      setFormData({
        CouponCode: data?.CouponCode ?? "",
        CouponPercentage: data?.CouponPercentage?.toString() ?? "",
        expirationDate: data?.expirationDate?.split("T")[0] ?? "",
        maxUsageLimit: data?.maxUsageLimit?.toString() ?? "",
        isActive: data?.isActive ?? false,
      });
    } else if (isAdd) {
      setFormData({
        CouponCode: "",
        CouponPercentage: "",
        expirationDate: "",
        maxUsageLimit: "",
        isActive: false,
      });
    }
  }, [isAdd, isUpdate, isView, fetchedData]);

  const handleClose = () => {
    onClose();
  };

  const validationSchema = Yup.object().shape({
    CouponCode: Yup.string()
      .matches(
        /^(?!\d+$)[a-zA-Z0-9_]+$/,
        "Must include letters (not just numbers)"
      )
      .required("Coupon Code is required"),
    CouponPercentage: Yup.number()
      .min(1)
      .max(100)
      .required("Percentage is required"),
    expirationDate: Yup.date().required("Expiration date is required"),
    maxUsageLimit: Yup.number().required("Max usage limit is required"),
    isActive: Yup.boolean(),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const cleanedValues = {
      CouponCode: values.CouponCode,
      CouponPercentage: Number(values.CouponPercentage),
      expirationDate: values.expirationDate,
      maxUsageLimit: Number(values.maxUsageLimit),
      isActive: values.isActive,
    };

    if (isAdd) {
      addCoupon.mutate(cleanedValues, {
        onSuccess: () => {
          toast.success("Coupon added successfully");
          onRefresh();
          handleClose();
        },
        onError: () => {
          toast.error("Failed to add coupon");
        },
        onSettled: () => setSubmitting(false),
      });
    }

    if (isUpdate && couponId && fetchedData) {
      const updatedFields = {};

      ALLOWED_FIELDS.forEach((key) => {
        const oldVal = fetchedData[key];

        if (key === "expirationDate") {
          const oldDate = oldVal?.split("T")[0];
          if (cleanedValues[key] !== oldDate) {
            updatedFields[key] = cleanedValues[key];
          }
        } else if (cleanedValues[key] !== oldVal) {
          updatedFields[key] = cleanedValues[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        setSubmitting(false);
        return;
      }

      updateCoupon.mutate(
        { id: couponId, data: updatedFields },
        {
          onSuccess: () => {
            toast.success("Coupon updated successfully");
            onRefresh();
            handleClose();
          },
          onError: () => {
            toast.error("Failed to update coupon");
          },
          onSettled: () => setSubmitting(false),
        }
      );
    }
  };

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4"
      onClick={handleClose}>
      <div
        className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 hover:bg-[rgba(0,0,0,0.15)] p-1 px-2 rounded-lg cursor-pointer">
          <X size={20} />
        </button>

        {(isAdd || isUpdate) && (
          <Formik
            initialValues={formData}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <h2 className="text-2xl font-bold text-teal-600 mb-2 border-b pb-2">
                  {isAdd ? "Add New Coupon" : "Update Coupon"}
                </h2>

                <div>
                  <label className="block mb-1 font-medium text-teal-900">
                    Coupon Code
                  </label>
                  <Field
                    name="CouponCode"
                    type="text"
                    className="input"
                    placeholder="Enter coupon code"
                  />
                  <ErrorMessage
                    name="CouponCode"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-teal-900">
                    Discount Percentage
                  </label>
                  <Field
                    name="CouponPercentage"
                    type="number"
                    className="input"
                    placeholder="1 - 100"
                  />
                  <ErrorMessage
                    name="CouponPercentage"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-teal-900">
                    Expiration Date
                  </label>
                  <Field name="expirationDate" type="date" className="input" />
                  <ErrorMessage
                    name="expirationDate"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-teal-900">
                    Max Usage Limit
                  </label>
                  <Field
                    name="maxUsageLimit"
                    type="number"
                    className="input"
                    placeholder="Enter max usage limit"
                  />
                  <ErrorMessage
                    name="maxUsageLimit"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <label className="inline-flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="isActive"
                    className="form-checkbox accent-teal-600 cursor-pointer"
                  />
                  <span className="text-teal-900 cursor-pointer">Active</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-teal w-full">
                  {isSubmitting
                    ? "Saving..."
                    : isAdd
                    ? "Add Coupon"
                    : "Update Coupon"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {isView && isLoading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}
        {isView && fetchedData && !isLoading && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-teal-600 border-b pb-2">
              Coupon Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <DetailCard label="Code" value={fetchedData.CouponCode} />
              <DetailCard
                label="Discount"
                value={`${fetchedData.CouponPercentage}%`}
              />
              <DetailCard
                label="Expires On"
                value={new Date(
                  fetchedData.expirationDate
                ).toLocaleDateString()}
              />
              <DetailCard
                label="Max Usage Limit"
                value={fetchedData.maxUsageLimit}
              />
              <DetailCard
                label="Status"
                value={
                  fetchedData.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )
                }
                fullWidth
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({ label, value, fullWidth }) {
  return (
    <div
      className={`p-3 border-2 border-teal-500 rounded-lg bg-gray-50 shadow-sm ${
        fullWidth ? "sm:col-span-2" : ""
      }`}>
      <span className="font-semibold text-teal-800">{label}:</span>
      <div className="mt-1 text-base text-black">{value}</div>
    </div>
  );
}
