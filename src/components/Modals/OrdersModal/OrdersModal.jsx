import { useEffect } from "react";
import { X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useOrder, useUpdateShippingStatus } from "../../../hooks/useOrders";
import { toast } from "react-toastify";

export function OrdersModal({ activeModal, orderId, onClose, onRefresh }) {
  const isUpdate = activeModal === "update";
  const isView = activeModal === "getById";

  const { data: orderData, isLoading } = useOrder(orderId);
  const updateMutation = useUpdateShippingStatus();

  useEffect(() => {
    if (!activeModal) {
      updateMutation.reset();
    }
  }, [activeModal, updateMutation]);

  const validationSchema = Yup.object().shape({
    shippingStatus: Yup.string().required("Shipping status is required"),
  });

  // ❇️ Disable all update functionality if canceled
  const isCanceled =
    orderData?.shippingStatus === "cancelled" ||
    orderData?.orderStatus === "cancelled";

  const handleSubmit = (values, { setSubmitting }) => {
    if (!orderId || isCanceled) {
      setSubmitting(false);
      return;
    }
    if (values.shippingStatus === orderData?.shippingStatus) {
      setSubmitting(false);
      return;
    }

    updateMutation.mutate(
      { id: orderId, shippingStatus: values.shippingStatus },
      {
        onSuccess: () => {
          toast.success("Order updated successfully");
          onRefresh();
          onClose();
        },
        onError: (err) => {
          toast.error("Failed to update order");
          console.error("❌ Update Error:", err);
        },
        onSettled: () => setSubmitting(false),
      }
    );
  };

  // ❇️ Handle Cancel Order button
  const handleCancelOrder = () => {
    if (!orderId || isCanceled) return;

    updateMutation.mutate(
      { id: orderId, shippingStatus: "cancelled" },
      {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
          onRefresh();
          onClose();
        },
        onError: () => {
          toast.error("Failed to cancel order");
        },
      }
    );
  };

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 relative  dark:bg-secondary-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 dark:text-white dark:hover:text-gray-200 text-gray-600 hover:text-gray-800 hover:bg-[rgba(0,0,0,0.15)] p-1 px-2 rounded-lg cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* UPDATE MODE */}
        {isUpdate &&
          orderData &&
          (isCanceled ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600 mb-4 border-b pb-2">
                This order is cancelled
              </h2>
              <p className="text-gray-700">Updates are disabled.</p>
            </div>
          ) : (
            <Formik
              initialValues={{
                shippingStatus: orderData.shippingStatus || "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h2 className="text-2xl font-bold text-accent  mb-4 border-b pb-2">
                    Update Shipping Status
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 text-accent  font-medium">
                        Shipping Status
                      </label>
                      <Field
                        as="select"
                        name="shippingStatus"
                        className="input"
                      >
                        <option value="" disabled>
                          Select Shipping Status
                        </option>
                        <option value="pending">Pending</option>
                        <option value="prepared">Prepared</option>
                        <option value="shipped">Shipped</option>
                      </Field>
                      <ErrorMessage
                        name="shippingStatus"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-modal-accent w-full"
                    >
                      {isSubmitting ? "Updating..." : "Update Order"}
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleCancelOrder}
                      className="btn-red w-full mt-2"
                    >
                      Cancel Order
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ))}

        {/* VIEW MODE */}
        {isView && isLoading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {isView && orderData && (
          <div className="space-y-4 max-h-[90vh] overflow-auto  dark:bg-secondary-dark">
            <h2 className="text-2xl font-bold text-accent  border-b pb-2 dark:text-accent-dark">
              Order Details
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
              <DetailCard label="Order ID" value={orderData?._id} fullWidth />
              <DetailCard
                label="Shipping Address"
                value={orderData?.shippingAddress}
                fullWidth
              />
              <DetailCard
                label="Total Price"
                value={`$${orderData?.totalPrice}`}
              />
              <DetailCard label="Order Status" value={orderData?.orderStatus} />
              <DetailCard
                label="Payment Method"
                value={orderData?.paymentMethod}
              />
              <DetailCard
                label="Shipping Status"
                value={orderData?.shippingStatus}
              />
              <DetailCard
                label="Order Items"
                value={
                  <ul className="list-disc list-inside text-base text-black dark:text-white">
                    {orderData?.orderItems?.map((item, index) => (
                      <li key={index}>
                        {item?.product?.title} × {item?.quantity}
                      </li>
                    ))}
                  </ul>
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
      className={`p-3 border-2 border-blue-500 rounded-lg bg-gray-50 shadow-sm dark:bg-secondary-dark ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <span className="font-semibold text-accent dark:text-accent-dark">
        {label}:
      </span>
      <div className="mt-1 text-base text-black break-words dark:text-white">{value}</div>
    </div>
  );
}
