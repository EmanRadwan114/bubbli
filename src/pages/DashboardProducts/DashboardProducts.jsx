import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash2 } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import {
  getAllProducts,
  useAddProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination/Pagination";
import { getProductById } from "../../services/productsService";
import { X } from "lucide-react";
import ProductsModal from "../../components/Modals/ProductsModal/ProductsModal";

const validationSchema = Yup.object().shape({
  title: Yup.string().min(4).required("Title is required"),
  material: Yup.string(),
  categoryID: Yup.string().required("Category is required"),
  price: Yup.number().min(0).required("Price is required"),
  stock: Yup.number().min(0).required("Stock is required"),
  discount: Yup.number().min(0).max(100),
  thumbnail: Yup.string().url("Thumbnail must be a valid URL").required(),
  color: Yup.string(),
  label: Yup.array().of(
    Yup.string().oneOf(["bestseller", "limited", "new", "hot", "deal"])
  ),
});

export default function ProductsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'update'
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const { data: productData, isLoading } = getAllProducts(currentPage, 6);
  const { data: categories = [] } = useCategories();
  const { mutateAsync: addProductMutation } = useAddProduct();
  const { mutateAsync: deleteProductMutation } = useDeleteProduct();
  const { mutateAsync: updateProductMutation } = useUpdateProduct();

  const productsList = productData?.data || [];
  const totalPages = productData?.totalPages || 1;

  const handlePagination = (page) => setCurrentPage(page);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedId(null);
    formik.resetForm();
  };

  const triggerDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProductMutation(deleteId);
      toast.success("Product deleted");
      setShowDeleteConfirm(false);
      setDeleteId(null);
      queryClient.invalidateQueries(["products"]);
    } catch (err) {
      toast.error("Failed to delete product");
      console.log(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      material: "",
      categoryID: "",
      price: 0,
      stock: 0,
      thumbnail: "",
      discount: 0,
      color: "",
      label: [],
      images: [],
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (activeModal === "add") {
          await addProductMutation(values);
          toast.success("Product added");
        } else if (activeModal === "update" && selectedId) {
          await updateProductMutation({ id: selectedId, data: values });
          toast.success("Product updated");
        }
        closeModal();
        queryClient.invalidateQueries(["products"]);
      } catch (error) {
        toast.error("Operation failed");
        console.log(error);
        console.log(error.response.data);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const openModal = async (type, id = null) => {
    setActiveModal(type);
    setSelectedId(id);

    if ((type === "update" || type === "view") && id) {
      setIsLoadingProduct(true);
      try {
        const { data } = await getProductById(id);
        const res = data[0];

        formik.setValues({
          title: res.title || "",
          material: res.material || "",
          categoryID: res.categoryID || "",
          price: res.price || 0,
          stock: res.stock || 0,
          thumbnail: res.thumbnail || "",
          color: res.color || "",
          description: res.description || "",
          images: res.images || [],
          label: res.label || [],
          discount: res.discount || 0,
        });
      } catch (err) {
        toast.error("Failed to load product");
        console.log(err);
      } finally {
        setIsLoadingProduct(false);
      }
    }
  };

  // if (isLoading) return <LoadingSpinner />;

  return (
<div className="px-4 py-6 dark:bg-black dark:text-light">
  {/* Add Product Button */}
  <div className="flex justify-end mb-4">
    <button
      onClick={() => openModal("add")}
      className="light-primary-btn dark-primary-btn px-4 py-2 rounded"
    >
      + Add Product
    </button>
  </div>
  {isLoading ? (
    <div className="flex justify-center py-10">
      <LoadingSpinner />
    </div>
  ) : (
    <>
      {/* Product Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md dark-shadow overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-secondary-dark">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Title / Material</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Label</th>
              <th className="px-6 py-4 text-left">Discount</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {productsList.map((prd) => (
              <tr key={prd._id} className="hover:bg-gray-50 dark:hover:bg-secondary-dark">
                <td className="px-4 py-2">
                  <img
                    src={prd.thumbnail}
                    alt={prd.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="font-medium dark:text-light">{prd.title}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">
                    {prd.material}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {prd.stock}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {categories.find((c) => c._id === prd.categoryID)?.name ||
                    "Unknown"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {prd.label?.map((label, idx) => {
                      // Dark mode compatible label colors
                      const labelStyles = {
                        bestseller: "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200",
                        limited: "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200",
                        new: "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200",
                        hot: "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200",
                        deal: "bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200",
                        default: "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                      };
                      
                      const style = labelStyles[label.toLowerCase()] || labelStyles.default;
                      
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${style}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="bg-blue-50 dark:bg-blue-900 rounded-full px-3 py-1 text-xs font-semibold text-blue-800 dark:text-blue-200">
                    {prd.discount}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  EGP {prd.price}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openModal("view", prd._id)}
                      title="View"
                    >
                      <Eye
                        size={20}
                        className="text-gray-600 dark:text-gray-300 hover:text-accent  dark:hover:text-accent-dark cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => openModal("update", prd._id)}
                      title="Edit"
                    >
                      <Pencil
                        size={20}
                        className="text-gray-600 dark:text-gray-300 hover:text-accent  dark:hover:text-accent-dark cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => triggerDelete(prd._id)}
                      title="Delete"
                    >
                      <Trash2
                        size={20}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600 cursor-pointer"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePagination={handlePagination}
        />
      </div>
    </>
  )}
  {/* Modal */}
  {(activeModal === "add" ||
    activeModal === "update" ||
    activeModal === "view") &&
    (isLoadingProduct ? (
      <LoadingSpinner />
    ) : (
      <ProductsModal
        activeModal={activeModal}
        isLoadingProduct={isLoadingProduct}
        formik={formik}
        categories={categories}
        closeModal={closeModal}
      />
    ))}

  {/* Delete Confirm Modal */}
  {showDeleteConfirm && (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] dark:bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-lg dark-shadow w-full max-w-sm text-center">
        <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
          Confirm Delete
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete this product?
        </p>
        <div className="flex justify-center gap-4">
          <button className="btn-red" onClick={confirmDelete}>
            Yes, Delete
          </button>
          <button
            className="btn-modal-accent"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
