import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useGetAllOrders, useDeleteOrder } from "../../hooks/useOrders";
import Pagination from "../../components/Pagination/Pagination";
import { OrdersModal } from "../../components/Modals/OrdersModal/OrdersModal";

export default function OrdersDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 7;

  const { data, isLoading, refetch } = useGetAllOrders(currentPage, limit);
  const deleteMutation = useDeleteOrder();

  const orders = data?.data?.data || [];
  const totalPages = data?.data?.totalPages || 1;

  const handleOpenModal = (type, id = null) => {
    setActiveModal(type);
    setSelectedId(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedId(null);
  };

  const triggerDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Order deleted successfully");
        refetch();
        cancelDelete();
      },
      onError: () => {
        toast.error("Failed to delete order");
        cancelDelete();
      },
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="px-4 py-6 dark:bg-black dark:text-light">
      {/* Orders Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md dark-shadow overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-secondary-dark">
            <tr>
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Order Status</th>
              <th className="px-6 py-4 text-left">Payment Method</th>
              <th className="px-6 py-4 text-left">Shipping Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length ? (
              orders.map((o) => (
                <tr
                  key={o._id}
                  className="hover:bg-gray-50 dark:hover:bg-secondary-dark"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {o?._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <ul className="flex flex-wrap gap-1">
                      {o?.orderItems?.map((item, index) => (
                        <li
                          key={index}
                          className="bg-indigo-50 dark:bg-indigo-800 dark:text-white  rounded-full px-3 py-1 text-xs font-semibold text-center"
                        >
                          {item?.product?.title || "Product"}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        o?.orderStatus === "paid"
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-800 dark:text-purple-100"
                          : o?.orderStatus === "cancelled"
                          ? "bg-red-50 text-red-600 dark:bg-red-800 dark:text-red-100"
                          : "bg-pink-50 text-pink-600  dark:bg-pink-800 dark:text-pink-100"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          o?.orderStatus === "paid"
                            ? "bg-purple-600 dark:bg-purple-100"
                            : o?.orderStatus === "cancelled"
                            ? "bg-red-600 dark:bg-red-100"
                            : "bg-pink-600 dark:bg-pink-100"
                        }`}
                      ></span>
                      {o?.orderStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold
                        ${
                          o?.paymentMethod === "online"
                            ? "bg-green-50 text-green-600 dark:bg-green-800 dark:text-green-100"
                            : "bg-orange-50 text-orange-600 dark:bg-orange-800 dark:text-orange-100"
                        }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          o?.paymentMethod === "online"
                            ? "bg-green-600 dark:bg-green-100"
                            : "bg-orange-600 dark:bg-orange-100"
                        }`}
                      ></span>
                      {o?.paymentMethod}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        o?.shippingStatus === "pending"
                          ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-100"
                          : o?.shippingStatus === "prepared"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-blue-100"
                          : o?.shippingStatus === "shipped"
                          ? "bg-green-50 text-green-600 dark:bg-green-800 dark:text-green-100"
                          : o?.shippingStatus === "cancelled"
                          ? "bg-red-50 text-red-600 dark:bg-red-800 dark:text-red-100"
                          : ""
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          o?.shippingStatus === "pending"
                            ? "bg-yellow-600 dark:bg-yellow-100"
                            : o?.shippingStatus === "prepared"
                            ? "bg-blue-600 dark:bg-blue-100"
                            : o?.shippingStatus === "shipped"
                            ? "bg-green-600 dark:bg-green-100"
                            : o?.shippingStatus === "cancelled"
                            ? "bg-red-600 dark:bg-red-100"
                            : ""
                        }`}
                      ></span>
                      {o?.shippingStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-5">
                      <button
                        onClick={() => handleOpenModal("getById", o?._id)}
                        title="View"
                      >
                        <Eye size={20} className="icons cursor-pointer" />
                      </button>
                      <button
                        onClick={() => handleOpenModal("update", o?._id)}
                        title="Edit"
                      >
                        <Pencil
                          size={20}
                          className="text-accent-dark hover:text-accent cursor-pointer"
                        />
                      </button>
                      <button
                        onClick={() => triggerDelete(o?._id)}
                        title="Delete"
                      >
                        <Trash2
                          size={20}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center dark:bg-secondary-dark">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Confirm Delete
            </h3>
            <p className="text-gray-700 mb-6 dark:text-white">
              Are you sure you want to delete this order?
            </p>
            <div className="flex justify-center gap-4">
              <button className="btn-red" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn-modal-accent " onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Component */}
      {activeModal && (
        <OrdersModal
          activeModal={activeModal}
          orderId={selectedId}
          onClose={handleCloseModal}
          onRefresh={refetch}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePagination={handlePageChange}
      />
    </div>
  );
}
