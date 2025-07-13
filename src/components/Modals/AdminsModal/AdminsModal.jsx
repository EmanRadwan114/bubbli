import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAddAdmin } from "../../../hooks/useAdmins";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function AdminsModal({ type, admin, onClose, onSaved }) {
  const isAdd = type === "add";
  const isView = type === "view";

  const addAdmin = useAddAdmin();

  // Local form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // When modal opens with admin, sync form data
  useEffect(() => {
    if (isView && admin) {
      setFormData({
        name: admin?.name ?? "",
        email: admin?.email ?? "",
        password: "",
      });
    } else if (isAdd) {
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [isAdd, isView, admin]);
  // Validation schema matching the addUserSchema spec
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "name must be at least 3 characters.")
      .required("name is required."),
    email: Yup.string()
      .email("please enter a valid email address.")
      .required("email is required."),
    password: Yup.string()
      .min(
        8,
        "password must be at least 8 characters, with uppercase, lowercase, number, and special character."
      )
      .required("password is required.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$-])[A-Za-z\d@_$-]{8,}$/,
        "password must be at least 8 characters, with uppercase, lowercase, number, and special character."
      ),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (isAdd) {
      addAdmin.mutate(values, {
        onSuccess: () => {
          toast.success("Admin added successfully");
          onSaved();
          onClose();
          resetForm();
        },
        onError: () => toast.error("Failed to add admin"),
        onSettled: () => setSubmitting(false),
      });
    }
  };

  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl p-6 space-y-4  dark:bg-secondary-dark relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 dark:text-white dark:hover:text-gray-200 right-3 text-gray-600 hover:text-gray-800 hover:bg-[rgba(0,0,0,0.15)] p-1 px-2 rounded-lg cursor-pointer"
        >
          <X size={20} />
        </button>

        {isAdd && (
          <Formik
            initialValues={formData}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <h2 className="text-2xl font-bold text-accent  mb-4 border-b pb-2">
                  {isAdd ? "Add New Admin" : "Edit Admin"}
                </h2>

                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block mb-1 text-accent  font-medium">
                      Name*
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="input"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block mb-1 text-accent  font-medium">
                      Email*
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="input"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block mb-1 text-accent  font-medium">
                      Password*
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="input"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-modal-accent w-full mt-4"
                  >
                    {isSubmitting ? "Processing..." : "Add Admin"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {isView && admin && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-accent  mb-4 border-b pb-2 dark:text-accent-dark">
              Admin Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <DetailCard label="Name" value={admin.name} />
              <DetailCard label="Email" value={admin.email} />
            </div>
            <button onClick={onClose} className="btn-modal-accent w-full mt-4">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="p-3 border-2 border-blue-400 rounded-lg bg-gray-50 shadow-sm dark:bg-secondary-dark">
      <div className="font-semibold text-accent dark:text-accent-dark ">
        {label}
      </div>
      <div className="mt-1 overflow-x-auto whitespace-nowrap scrollbar-hide dark:text-white">
        {value}
      </div>
    </div>
  );
}
