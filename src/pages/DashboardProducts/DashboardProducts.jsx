import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
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

    if (type === "update" && id) {
      setIsLoadingProduct(true);
      try {
        const { data } = await getProductById(id);
        const res = data[0];
        console.log("Loaded values:", res);
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

  return (
    <div className="px-4 py-6">
      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal("add")}
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>
      {/* Product Table */}
      <div className="overflow-auto border rounded shadow">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title / Material</th>
              <th className="px-4 py-2 text-center">Stock</th>
              <th className="px-4 py-2 text-center">Category</th>
              <th className="px-4 py-2 text-center">Price</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((prd) => (
              <tr key={prd._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <img
                    src={prd.thumbnail}
                    alt={prd.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="font-medium">{prd.title}</div>
                  <div className="text-gray-500 text-sm">{prd.material}</div>
                </td>
                <td className="px-4 py-2 text-center">{prd.stock}</td>
                <td className="px-4 py-2 text-center">
                  {categories.find((c) => c._id === prd.categoryID)?.name ||
                    "Unknown"}
                </td>
                <td className="px-4 py-2 text-center">EGP {prd.price}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal("update", prd._id)}>
                      ✏️
                    </button>
                    <button onClick={() => triggerDelete(prd._id)}>🗑️</button>
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

      {/* Modal */}
      {activeModal === "add" ||
      (activeModal === "update" && !isLoadingProduct) ? (
        <ProductsModal
          activeModal={activeModal}
          isLoadingProduct={isLoadingProduct}
          formik={formik}
          categories={categories}
          closeModal={closeModal}
        />
      ) : null}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-600 mb-4 text-center">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
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
