import React, { useState } from "react";
import { useAddCategory, useCategories, useDeleteCategory, useUpdateCategory } from "../../hooks/useCategories";
import { Eye, Pencil, Trash2, PlusCircle, X, Check } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

export default function DashboardCategories() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: categoriesList = [], isLoading, isError } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const openModal = (type, id = null) => {
    setActiveModal(type);
    setSelectedId(id);
  };

  const closeModal = () => {
    setActiveModal("");
    setSelectedId(null);
  };

  const triggerDelete = (id) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    deleteCategory.mutate(selectedId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setSelectedId(null);
      },
    });
  };

  const cancelDelete = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const thumbnail = form.thumbnail.value.trim();

    const categoryData = { name, thumbnail };

    if (activeModal === "add") {
      addCategory.mutate(categoryData, {
        onSuccess: () => closeModal(),
      });
    } else {
      updateCategory.mutate(
        { id: selectedId, updatedCat: categoryData },
        {
          onSuccess: () => closeModal(),
        }
      );
    }
  };

  return (
    <div className="px-4 mb-5">
      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => openModal("add")} className="light-primary-btn dark-primary-btn flex items-center gap-2 px-4 py-2 rounded">
          <PlusCircle className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      {/* Loading/Error State */}
      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {isError && <p className="text-center text-red-500">Error loading categories.</p>}

      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesList.map((category) => (
          <div
            key={category._id}
            className="relative flex flex-col justify-end overflow-hidden rounded-xl pt-6 shadow bg-gray-100 dark:bg-secondary-dark dark:shadow-light"
          >
            <div className="flex items-center justify-between px-4">
              <img className="rounded-full w-20 h-20 object-cover border-4 border-white shadow -mt-4" src={category.thumbnail} alt={category.name} />
              <div className="flex gap-3">
                <button onClick={() => openModal("getById", category._id)}>
                  <Eye className="w-5 h-5 text-gray-900 dark:text-light" />
                </button>
                <button onClick={() => openModal("update", category._id)}>
                  <Pencil className="w-5 h-5 text-accent dark:text-accent-dark" />
                </button>
                <button onClick={() => triggerDelete(category._id)}>
                  <Trash2 className="w-5 h-5 text-red-800 dark:text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-primary dark:text-primary-dark">{category.name}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-center p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Confirm Delete</h3>
            <p className="text-gray-700 dark:text-light mb-6">Are you sure you want to delete this category?</p>
            <div className="flex justify-center gap-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1" onClick={confirmDelete}>
                <Check className="w-4 h-4" />
                Yes, Delete
              </button>
              <button className="bg-accent text-white px-4 py-2 rounded hover:bg-[#4982aa] flex items-center gap-1" onClick={cancelDelete}>
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Category Modal */}
      {activeModal === "getById" && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-primary dark:text-primary-dark border-b-2 border-primary-dark pb-2">Category Details</h2>
            <div className="mb-4 flex justify-center flex-row gap-2">
              <p className="text-gray-700 dark:text-white mb-2 border-2 border-primary px-4 py-2 flex-1/2 rounded-2xl">
                <strong className="text-primary dark:text-primary-dark">Name:</strong>
                <p>{categoriesList.find((cat) => cat._id === selectedId)?.name}</p>
              </p>
              <p className="text-gray-700 dark:text-white mb-2 py-2 border-2 border-primary px-4 flex-1/2 rounded-2xl">
                <strong className="text-primary dark:text-primary-dark">Thumbnail:</strong>
                <div className="text-center">
                  <img
                    src={categoriesList.find((cat) => cat._id === selectedId)?.thumbnail}
                    alt="Category Thumbnail"
                    className="w-32 h-32 object-cover rounded-2xl mt-2"
                  />
                </div>
              </p>
            </div>
            <div className="flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 light-primary-btn dark-primary-btn text-center font-bold rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Update Modal */}
      {(activeModal === "add" || activeModal === "update") && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-primary dark:text-primary-dark border-b-2 border-primary-dark pb-2">
              {activeModal === "add" ? "Add Category" : "Update Category"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Category name"
                defaultValue={activeModal === "update" ? categoriesList.find((cat) => cat._id === selectedId)?.name : ""}
                className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
                required
              />
              <input
                name="thumbnail"
                placeholder="Thumbnail URL"
                defaultValue={activeModal === "update" ? categoriesList.find((cat) => cat._id === selectedId)?.thumbnail : ""}
                className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
                required
              />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-accent">
                  {activeModal === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
