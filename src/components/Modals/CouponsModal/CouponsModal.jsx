import { useForm, Controller } from "react-hook-form";
import {
  useAddCoupon,
  useUpdateCoupon,
  useGetCouponById,
} from "../../../hooks/useCoupons";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function CouponsModal({
  activeModal,
  couponId,
  onClose,
  onRefresh,
}) {
  const isAdd = activeModal === "add";
  const isUpdate = activeModal === "update";
  const isView = activeModal === "getById";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      CouponCode: "",
      CouponPercentage: "",
      expirationDate: "",
      maxUsageLimit: "",
      isActive: false,
    },
  });

  const addCoupon = useAddCoupon();
  const updateCoupon = useUpdateCoupon();
  const { data: couponData, isLoading } = useGetCouponById(couponId);

  useEffect(() => {
    if (isUpdate && couponData) {
      reset(couponData);
    }
  }, [couponData, isUpdate, reset]);

  const closeModal = () => {
    reset();
    onClose();
  };

  const onSubmit = (formValues) => {
    console.log("Submitting:", formValues);
    if (isAdd) {
      addCoupon.mutate(formValues, {
        onSuccess: () => {
          toast.success("Coupon added successfully");
          onRefresh();
          closeModal();
        },
        onError: () => {
          toast.error("Failed to add coupon");
        },
      });
    }

    if (isUpdate && couponId) {
      const updatedFields = {};
      Object.keys(formValues).forEach((key) => {
        if (
          formValues[key] !== "" &&
          formValues[key] !== null &&
          formValues[key] !== couponData?.[key]
        ) {
          updatedFields[key] = formValues[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) return;

      updateCoupon.mutate(
        { id: couponId, data: updatedFields },
        {
          onSuccess: () => {
            toast.success("Coupon updated successfully");
            onRefresh();
            closeModal();
          },
          onError: () => {
            toast.error("Failed to update coupon");
          },
        }
      );
    }
  };

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4"
      onClick={closeModal}>
      <div
        className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 hover:bg-[rgba(0,0,0,0.15)] p-1 px-2 rounded-lg cursor-pointer">
          <X size={20} />
        </button>

        {(isAdd || isUpdate) && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-2xl font-bold text-teal-600 mb-2 border-b pb-2">
              {isAdd ? "Add New Coupon" : "Update Coupon"}
            </h2>

            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Coupon Code
              </label>
              <input
                {...register("CouponCode", {
                  required: isAdd,
                  pattern: /^(?!\d+$)[a-zA-Z0-9_]+$/,
                })}
                placeholder="Enter coupon code"
                className="input"
                type="text"
              />
              {errors.CouponCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.CouponCode.type === "required"
                    ? "Coupon Code is required."
                    : "Must include letters (not just numbers)."}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Discount Percentage
              </label>
              <input
                {...register("CouponPercentage", {
                  required: isAdd,
                  min: 1,
                  max: 100,
                })}
                type="number"
                placeholder="1 - 100"
                className="input"
              />
              {errors.CouponPercentage && (
                <p className="text-red-500 text-sm mt-1">
                  Percentage must be between 1 and 100.
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Expiration Date
              </label>
              <input
                {...register("expirationDate", {
                  required: isAdd,
                })}
                type="date"
                className="input"
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-sm mt-1">
                  Expiration date is required.
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Max Usage Limit
              </label>
              <input
                {...register("maxUsageLimit", {
                  required: isAdd,
                })}
                type="number"
                placeholder="Enter max usage limit"
                className="input"
              />
              {errors.maxUsageLimit && (
                <p className="text-red-500 text-sm mt-1">
                  Max usage limit is required.
                </p>
              )}
            </div>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isActive")}
                className="form-checkbox accent-teal-600 cursor-pointer"
              />
              <span className="text-teal-900 cursor-pointer">Active</span>
            </label>

            <button type="submit" className="btn-teal w-full">
              {isAdd ? "Add Coupon" : "Update Coupon"}
            </button>
          </form>
        )}

        {isView && couponData && !isLoading && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-teal-600 border-b pb-2">
              Coupon Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <DetailCard label="Code" value={couponData.CouponCode} />
              <DetailCard
                label="Discount"
                value={`${couponData.CouponPercentage}%`}
              />
              <DetailCard
                label="Expires On"
                value={new Date(couponData.expirationDate).toLocaleDateString()}
              />
              <DetailCard
                label="Max Usage Limit"
                value={couponData.maxUsageLimit}
              />
              <DetailCard
                label="Status"
                value={
                  couponData.isActive ? (
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

        {isView && isLoading && (
          <p className="text-center text-gray-500">Loading...</p>
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
