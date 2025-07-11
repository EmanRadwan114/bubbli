import { useState } from "react";
import { useGetCoupons, useDeleteCoupon } from "../../hooks/useCoupons";
import Pagination from "../../components/Pagination/Pagination";
import CouponsModal from "../../components/Modals/CouponsModal/CouponsModal";
import { toast } from "react-toastify";

// Lucide Icons
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function CouponsDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, refetch } = useGetCoupons(currentPage, limit);
  const deleteMutation = useDeleteCoupon();

  const coupons = data?.data || [];
  const totalPages = data?.totalPages || 1;

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

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Coupon deleted successfully");
          refetch();
          cancelDelete();
        },
        onError: () => {
          toast.error("Failed to delete coupon");
          cancelDelete();
        },
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-4">
      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal("add")} className="btn-teal">
          + Add New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-lg border border-gray-200 shadow-md overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Discount</th>
              <th className="px-6 py-4 text-left">Expires</th>
              <th className="px-6 py-4 text-left">Max Usage</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length ? (
              coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.CouponCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="bg-blue-50 rounded-full px-6 py-2 text-xs font-semibold">
                      {c.CouponPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(c.expirationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="bg-pink-50 rounded-full px-6 py-2 text-xs font-semibold">
                      {c.maxUsageLimit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold
                      ${
                        c.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          c.isActive ? "bg-green-600" : "bg-red-600"
                        }`}></span>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-5">
                      <button
                        onClick={() => handleOpenModal("getById", c._id)}
                        title="View">
                        <Eye size={20} className="icons cursor-pointer" />
                      </button>
                      <button
                        onClick={() => handleOpenModal("update", c._id)}
                        title="Edit">
                        <Pencil
                          size={20}
                          className="text-accent-dark hover:text-accent cursor-pointer"
                        />
                      </button>
                      <button
                        onClick={() => triggerDelete(c._id)}
                        title="Delete">
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
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Confirm Delete
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this coupon?
            </p>
            <div className="flex justify-center gap-4">
              <button className="btn-red" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn-teal" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Component */}
      <CouponsModal
        activeModal={activeModal}
        couponId={selectedId}
        onClose={handleCloseModal}
        onRefresh={refetch}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePagination={handlePageChange}
      />
    </div>
  );
}
