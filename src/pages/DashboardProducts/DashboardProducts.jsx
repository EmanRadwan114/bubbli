import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { getAllProducts, useAddProduct, useDeleteProduct, useUpdateProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination/Pagination";
import { getProductById } from "../../services/productsService";

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

  // const openModal = (type, id = null) => {
  //   setActiveModal(type);
  //   setSelectedId(id);
  // };

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
      } finally {
        setSubmitting(false);
      }
    },
  });

  // useEffect(() => {
  //   if (activeModal === "update" && selectedId) {
  //     getProductById(selectedId).then((res) => {
  //       formik.setValues({
  //         title: res.title || "",
  //         material: res.material || "",
  //         categoryID: res.categoryID || "",
  //         price: res.price || 0,
  //         stock: res.stock || 0,
  //         thumbnail: res.thumbnail || "",
  //         color: res.color || "",
  //         description: res.description || "",
  //         images: res.images || [""],
  //         label: res.label || [],
  //       });
  //     });
  //   }
  // }, [activeModal, selectedId]);  
  
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
          images: res.images?.length ? res.images : [""],
          label: res.label || [],
          discount: res.discount || 0,
        });
      } catch (err) {
        toast.error("Failed to load product");
        console.log(err)
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {activeModal === "add" ? "Add Product" : "Update Product"}
            </h2>
            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Material
                </label>
                <input
                  name="material"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.material}
                />
                {formik.touched.material && formik.errors.material && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.material}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  name="color"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.color}
                />
                {formik.touched.color && formik.errors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.color}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.stock}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.stock}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.discount}
                />
                {formik.touched.discount && formik.errors.discount && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.discount}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="categoryID"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.categoryID}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formik.touched.categoryID && formik.errors.categoryID && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.categoryID}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Thumbnail
                </label>
                <input
                  name="thumbnail"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.thumbnail}
                />
                {formik.touched.thumbnail && formik.errors.thumbnail && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.thumbnail}
                  </p>
                )}
                {formik.values.thumbnail && (
                  <img
                    src={formik.values.thumbnail}
                    alt="Preview"
                    className="w-24 h-24 mt-2 rounded object-cover"
                  />
                )}
              </div>

              {formik.values.images.map((img, idx) => (
                <div key={idx} className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Image {idx + 1}
                  </label>
                  <input
                    name={`images[${idx}]`}
                    className="w-full p-2 border rounded"
                    value={img}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.images &&
                    formik.errors.images &&
                    formik.errors.images[idx] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.images[idx]}
                      </p>
                    )}
                </div>
              ))}

              <div className="col-span-2">
                <button
                  type="button"
                  className="text-sm text-blue-600"
                  onClick={() =>
                    formik.setFieldValue("images", [
                      ...formik.values.images,
                      "",
                    ])
                  }
                >
                  + Add another image
                </button>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Labels</label>
                <div className="flex flex-wrap gap-3">
                  {["bestseller", "limited", "new", "hot", "deal"].map(
                    (label) => (
                      <label
                        key={label}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          name="label"
                          value={label}
                          checked={formik.values.label.includes(label)}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            const next = checked
                              ? [...formik.values.label, value]
                              : formik.values.label.filter((l) => l !== value);
                            formik.setFieldValue("label", next);
                          }}
                        />
                        {label}
                      </label>
                    )
                  )}
                </div>
                {formik.touched.label && formik.errors.label && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.label}
                  </p>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="px-4 py-2 rounded bg-teal-600 text-white"
                >
                  {activeModal === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
