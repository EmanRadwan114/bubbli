import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import AdminsModal from "../../components/Modals/AdminsModal/AdminsModal";
import Pagination from "../../components/Pagination/Pagination";
import { useGetAdmins, useDeleteAdmin } from "../../hooks/useAdmins";

export default function AdminsDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = useGetAdmins(currentPage, limit);

  const deleteAdminMutation = useDeleteAdmin();

  const admins = (data?.data || []).filter((user) => user?.role === "admin");
  const totalPages = data?.totalPages || 1;

  const handleOpenModal = (type, admin = null) => {
    setActiveModal(type);
    setSelectedAdmin(admin);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedAdmin(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const confirmDelete = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setAdminToDelete(null);
    setShowDeleteConfirm(false);
  };

  const deleteAdmin = () => {
    if (!adminToDelete?._id) return;

    deleteAdminMutation.mutate(adminToDelete._id, {
      onSuccess: () => {
        toast.success("Admin deleted successfully");
        cancelDelete();
      },
      onError: () => {
        toast.error("Failed to delete admin");
        cancelDelete();
      },
    });
  };

  return (
    <div className="p-4">
      {/* Add New Admin Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal("add")} className="btn-teal">
          + Add New Admin
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading admins...</p>
        </div>
      )}

      {/* Admins Table */}
      {!isLoading && (
        <div className="w-full overflow-auto">
          <div className="rounded-lg border border-gray-200 shadow-md">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{admin.name}</td>
                      <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-5">
                          <button
                            onClick={() => handleOpenModal("view", admin)}
                            title="View">
                            <Eye size={20} className="icons cursor-pointer" />
                          </button>
                          <button
                            onClick={() => confirmDelete(admin)}
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
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Modal Component */}
      {activeModal && (
        <AdminsModal
          type={activeModal}
          admin={selectedAdmin}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Confirm Delete
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete admin{" "}
              <strong>{adminToDelete?.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={deleteAdmin} className="btn-red">
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="btn-teal">
                Cancel
              </button>
            </div>
          </div>
        </div>
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
