import { X } from "lucide-react";

export default function ProductsModal({
  activeModal,
  isLoadingProduct,
  formik,
  categories,
  closeModal,
}) {
  if (!activeModal || (activeModal === "update" && isLoadingProduct))
    return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-xl p-6 space-y-4 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 hover:bg-[rgba(0,0,0,0.15)] p-1 px-2 rounded-lg cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-teal-600 mb-2 border-b pb-2">
          {activeModal === "add" ? "Add Product" : "Update Product"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Title
              </label>
              <input
                name="title"
                className="input"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium text-teal-900">
                  Material
                </label>
                <input
                  name="material"
                  className="input"
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
                <label className="block mb-1 font-medium text-teal-900">
                  Color
                </label>
                <input
                  name="color"
                  className="input"
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
                <label className="block mb-1 font-medium text-teal-900">
                  Category
                </label>
                <select
                  name="categoryID"
                  className="input"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium text-teal-900">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  className="input"
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
                <label className="block mb-1 font-medium text-teal-900">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  className="input"
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
                <label className="block mb-1 font-medium text-teal-900">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  className="input"
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
            </div>

            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="input"
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

            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Thumbnail
              </label>
              <input
                name="thumbnail"
                className="input"
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
              <div key={idx}>
                <label className="block mb-1 font-medium text-teal-900">
                  Image {idx + 1}
                </label>
                <input
                  name={`images[${idx}]`}
                  className="input"
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

            <div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() =>
                  formik.setFieldValue("images", [...formik.values.images, ""])
                }
              >
                + Add another image
              </button>
            </div>

            <div>
              <label className="block mb-1 font-medium text-teal-900">
                Labels
              </label>
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
                        className="accent-teal-600 cursor-pointer"
                      />
                      <span className="text-teal-900 cursor-pointer">
                        {label}
                      </span>
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
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium"
            >
              {activeModal === "add" ? "Add Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
