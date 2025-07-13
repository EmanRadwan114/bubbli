import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useProfileData,
  useUserOrders,
  useUpdateProfile,
  useUpdatePassword,
} from "../../hooks/useUser";

// Icons
import {
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Lock,
  User,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Gift,
} from "lucide-react";
import { logout, refundOrder } from "../../services/userService";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../components/Pagination/Pagination";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const user = localStorage.getItem("user");

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1) {
      setCurrentPage(newPage);
    }
  };

  // Validation schemas
  const profileValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const passwordValidationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Current password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
        "Must contain uppercase, lowercase, number, and special character"
      ),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
        "Must contain uppercase, lowercase, number, and special character"
      )
      .notOneOf(
        [Yup.ref("oldPassword"), null],
        "New password must be different from current password"
      ),
  });

  // Data fetching
  const { data: { data: profileData = {} } = {}, isLoading: isProfileLoading } =
    useProfileData();
  const {
    data: { data: userOrders = [], totalPages = 1 } = {},
    isLoading: isOrdersLoading,
    refetch,
  } = useUserOrders(currentPage);
  const { mutateAsync: updateUserData, isPending: isUpdatePending } =
    useUpdateProfile();
  const { mutateAsync: updatePassword, isPending: isPasswordPending } =
    useUpdatePassword();

  const navigate = useNavigate();

  useEffect(() => {
    if (profileData?.address) {
      setAddresses(
        Array.isArray(profileData.address)
          ? profileData.address
          : [profileData.address]
      );
    }
  }, [profileData]);

  const handleLogOut = async () => {
    await logout();
    navigate("/");
    toast.success("Logged Out Successfully!");
  };

  // Form handlers
  const personalDataForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profileData.name || "",
      email: profileData.email || "",
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      await updateUserData({
        ...values,
        address: addresses,
      });
      setEditMode(false);
    },
  });

  const passwordForm = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      if (values.newPassword !== confirmPassword) {
        toast.error("New passwords do not match!");
        return;
      }
      await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
    },
  });

  // Address management
  const addAddress = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress.trim()]);
      setNewAddress("");
    }
  };

  const removeAddress = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setConfirmPassword("");
    passwordForm.resetForm();
  };

  const renderProfileSection = () => (
    <div className="bg-white rounded-lg shadow-md dark:bg-gray-900 dark:text-light">
      {isProfileLoading ? (
        <LoadingSpinner height="h-[300px]" />
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            {!editMode && (
              <button
                onClick={handleEditClick}
                className="flex items-center border-2 border-primary text-primary px-4 py-2 rounded hover:bg-secondary dark:hover:bg-secondary-dark transition-colors"
              >
                <Edit className="mr-2" />
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start mb-4">
              <Mail className="text-accent dark:text-accent-dark mr-2 mt-1" />
              {editMode ? (
                <div className="w-full">
                  <label className="block text-accent dark:text-accent-dark mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={personalDataForm.values.email || ""}
                    onChange={personalDataForm.handleChange}
                    onBlur={personalDataForm.handleBlur}
                    className={`w-full p-2 border rounded ${
                      personalDataForm.touched.email &&
                      personalDataForm.errors.email
                        ? "border-red-500"
                        : "dark:border-white"
                    }`}
                  />
                  {personalDataForm.touched.email &&
                    personalDataForm.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {personalDataForm.errors.email}
                      </p>
                    )}
                </div>
              ) : (
                <p>{profileData?.email}</p>
              )}
            </div>

            {/* Address Management */}
            <div className="col-span-2">
              <div className="flex items-start mb-4">
                <MapPin className="text-accent dark:text-accent-dark mr-2 mt-1" />
                {editMode ? (
                  <div className="w-full">
                    <label className="block text-accent dark:text-accent-dark mb-1">
                      Addresses
                    </label>
                    <div className="space-y-2">
                      {addresses.map((address, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                              const updated = [...addresses];
                              updated[index] = e.target.value;
                              setAddresses(updated);
                            }}
                            className="flex-1 p-2 border dark:border-white rounded mr-2"
                          />
                          <button
                            onClick={() => removeAddress(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X />
                          </button>
                        </div>
                      ))}
                      <div className="flex">
                        <input
                          type="text"
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder="Add new address"
                          className="flex-1 p-2 border dark:border-white rounded mr-2"
                        />
                        <button
                          onClick={addAddress}
                          className="bg-primary text-white px-6 rounded hover:bg-accent transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Current Address:</p>
                    <p>
                      {addresses.length > 0
                        ? addresses[addresses.length - 1]
                        : "No address provided"}
                    </p>
                    {addresses.length > 1 && (
                      <div className="mt-2">
                        <p className="font-medium">Previous Addresses:</p>
                        <ul className="list-disc pl-5">
                          {addresses.slice(0, -1).map((addr, idx) => (
                            <li key={idx}>{addr}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {editMode && (
              <div className="col-span-2 flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center text-primary px-4 py-2 rounded cursor-pointer transition-colors"
                >
                  <X className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={() => personalDataForm.handleSubmit()}
                  disabled={isUpdatePending}
                  className="flex items-center bg-primary text-white px-4 py-2 rounded hover:bg-accent transition-colors"
                >
                  {isUpdatePending ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <Save className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {!user?.iss && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center flex-wrap">
                <Lock className="text-primary mr-2" />
                <p className="mr-4">Password</p>
                <button
                  onClick={handlePasswordDialogOpen}
                  className="mt-2 md:mt-0 border-2 border-primary text-primary px-4 py-2 rounded hover:bg-secondary dark:hover:bg-secondary-dark transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderOrderHistory = () => (
    <div className="bg-white rounded-lg shadow-md dark:bg-gray-900 dark:text-light">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Order History</h3>

        {isOrdersLoading ? (
          <LoadingSpinner height="h-[300px]" />
        ) : userOrders?.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="text-5xl text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg text-gray-600 dark:text-gray-400">
              No orders yet
            </h4>
            <button
              className="mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-accent transition-colors"
              onClick={() => navigate("/gifts")}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden">
              <div className="space-y-2">
                {userOrders?.map((order) => (
                  <div key={order._id} className="border rounded p-3">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleOrderExpand(order._id)}
                    >
                      <div className="flex items-center">
                        {expandedOrder === order._id ? (
                          <ChevronUp className="mr-2" />
                        ) : (
                          <ChevronDown className="mr-2" />
                        )}
                        <div>
                          <p className="font-medium">
                            Order #{order._id.slice(19, 24)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {order.totalPrice.toFixed(2)} EGP
                      </span>
                    </div>

                    {expandedOrder === order._id && (
                      <div className="mt-3 pl-6">
                        <div className="space-y-2">
                          {order.orderItems.map((item, index) => (
                            <p key={index} className="text-sm">
                              {item?.product?.title}
                            </p>
                          ))}
                        </div>
                        <div className="mt-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs text-white ${
                              order.shippingStatus === "shipped"
                                ? "bg-green-500"
                                : order.shippingStatus === "prepared"
                                ? "bg-orange-500"
                                : "bg-red-600"
                            }`}
                          >
                            {order.shippingStatus}
                          </span>
                          {order.shippingStatus !== "cancelled" && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="text-red-500 hover:text-white ml-4 hover:bg-red-500 px-3  outline rounded-full text-sm cursor-pointer inline "
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                        <div className="mt-3">
                          <Link
                            to={`/order-confirmation/${order._id}`}
                            className="text-primary hover:underline"
                          >
                            Show Details
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Order ID</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Items</th>
                      <th className="text-left py-2">Total</th>
                      <th className="text-left py-2">Payment Method</th>
                      <th className="text-left py-2">Shipping Status</th>
                      <th className="text-left py-2">Details</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders?.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="py-3">#{order._id.slice(19, 24)}</td>
                        <td className="py-3">{formatDate(order.createdAt)}</td>
                        <td className="py-3">
                          <div className="space-y-1">
                            {order.orderItems.map((item, index) => (
                              <p key={index} className="text-sm">
                                {item?.product?.title}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-3">
                          {order.totalPrice.toFixed(2)} EGP
                        </td>
                        <td className="py-3">
                          <span className="inline-block px-3 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-800">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs text-white ${
                              order.shippingStatus === "shipped"
                                ? "bg-green-500"
                                : order.shippingStatus === "prepared"
                                ? "bg-orange-500"
                                : "bg-red-600"
                            }`}
                          >
                            {order.shippingStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <Link
                            to={`/order-confirmation/${order._id}`}
                            className="text-primary hover:underline"
                          >
                            <Eye />
                          </Link>
                        </td>
                        {order.shippingStatus !== "cancelled" && (
                          <td className="py-3">
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="text-red-500 hover:text-white hover:bg-red-500 px-4  outline rounded-2xl cursor-pointer"
                            >
                              {order?.shippingStatus == "shipped"
                                ? "Return"
                                : "Cancel"}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePagination={handlePagination}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const handleCancelOrder = async (orderId) => {
    try {
      await refundOrder(orderId);
      refetch();
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="container mx-auto py-10 px-6 lg:px-14">
      {isProfileLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Side - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md dark:bg-gray-900 dark:text-light h-full min-h-[400px]">
                <div className="p-6 flex flex-col items-center">
                  <div className="relative mb-6">
                    <img
                      src={profileData?.image}
                      alt="Profile"
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary object-cover"
                    />
                    <button
                      onClick={
                        editMode
                          ? personalDataForm.handleSubmit
                          : handleEditClick
                      }
                      disabled={isProfileLoading || isOrdersLoading}
                      className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-accent transition-colors"
                    >
                      {editMode ? (
                        isUpdatePending ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <Save />
                        )
                      ) : (
                        <Edit />
                      )}
                    </button>
                  </div>

                  {editMode ? (
                    <div className="w-full mb-4">
                      <label className="block text-accent dark:text-accent-dark mb-1">
                        Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={personalDataForm.values.name || ""}
                        onChange={personalDataForm.handleChange}
                        onBlur={personalDataForm.handleBlur}
                        className={`w-full p-2 border rounded ${
                          personalDataForm.touched.name &&
                          personalDataForm.errors.name
                            ? "border-red-500"
                            : "dark:border-white"
                        }`}
                      />
                      {personalDataForm.touched.name &&
                        personalDataForm.errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {personalDataForm.errors.name}
                          </p>
                        )}
                    </div>
                  ) : (
                    <h2 className="text-xl md:text-2xl font-semibold mb-2 capitalize">
                      {profileData.name}
                    </h2>
                  )}

                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Member since{" "}
                    {new Date(profileData?.createdAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={handleLogOut}
                    className="border-2 border-red-700 text-red-700 px-4 py-2 rounded hover:bg-red-700 hover:text-white transition-colors w-4/5"
                  >
                    Sign Out
                  </button>

                  <div className="w-full border-t my-4"></div>

                  <div className="w-full">
                    <div className="flex border-b">
                      <button
                        onClick={() => handleTabChange(0)}
                        className={`flex-1 py-2 flex items-center justify-center ${
                          activeTab === 0
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500"
                        }`}
                      >
                        <User className="mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleTabChange(1)}
                        className={`flex-1 py-2 flex items-center justify-center ${
                          activeTab === 1
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500"
                        }`}
                      >
                        <ShoppingBag className="mr-2" />
                        Orders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:col-span-3">
              {activeTab === 0 ? renderProfileSection() : renderOrderHistory()}
            </div>
          </div>

          {!user?.iss && (
            <div
              className={`fixed inset-0 bg-gray-900/45 flex items-center justify-center p-4 ${
                openPasswordDialog ? "block" : "hidden"
              } z-50`}
            >
              <div className="bg-white dark:bg-gray-900 dark:text-light rounded-lg shadow-lg w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Change Password
                  </h3>

                  {/* Current Password */}
                  <div className="mb-4">
                    <label className="block text-accent dark:text-accent-dark mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.old ? "text" : "password"}
                        name="oldPassword"
                        value={passwordForm.values.oldPassword}
                        onChange={passwordForm.handleChange}
                        onBlur={passwordForm.handleBlur}
                        className={`w-full p-2 border rounded pr-10 ${
                          passwordForm.touched.oldPassword &&
                          passwordForm.errors.oldPassword
                            ? "border-red-500"
                            : "dark:border-white"
                        }`}
                      />
                      <button
                        onClick={() => toggleShowPassword("old")}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showPassword.old ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {passwordForm.touched.oldPassword &&
                      passwordForm.errors.oldPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordForm.errors.oldPassword}
                        </p>
                      )}
                  </div>

                  {/* New Password */}
                  <div className="mb-4">
                    <label className="block text-accent dark:text-accent-dark mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.values.newPassword}
                        onChange={passwordForm.handleChange}
                        onBlur={passwordForm.handleBlur}
                        className={`w-full p-2 border rounded pr-10 ${
                          passwordForm.touched.newPassword &&
                          passwordForm.errors.newPassword
                            ? "border-red-500"
                            : "dark:border-white"
                        }`}
                      />
                      <button
                        onClick={() => toggleShowPassword("new")}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showPassword.new ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {passwordForm.touched.newPassword &&
                      passwordForm.errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordForm.errors.newPassword}
                        </p>
                      )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label className="block text-accent dark:text-accent-dark mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setConfirmPasswordTouched(true)}
                        className={`w-full p-2 border rounded pr-10 ${
                          confirmPasswordTouched &&
                          confirmPassword !== passwordForm.values.newPassword
                            ? "border-red-500"
                            : "dark:border-white"
                        }`}
                      />
                      <button
                        onClick={() => toggleShowPassword("confirm")}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showPassword.confirm ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {confirmPasswordTouched &&
                      confirmPassword !== passwordForm.values.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          Passwords do not match
                        </p>
                      )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handlePasswordDialogClose}
                      className="text-primary px-4 py-2 rounded cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => passwordForm.handleSubmit()}
                      disabled={isPasswordPending || !confirmPassword}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-accent transition-colors"
                    >
                      {isPasswordPending ? (
                        <LoadingButton size="small" />
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
