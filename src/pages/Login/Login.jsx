import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "./../../components/LoadingButton/LoadingButton";
import {
  CircleAlert,
  CircleCheck,
  Gift,
  KeyRound,
  LockKeyhole,
  Mail,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUserGoogleLogin, useUserLogin } from "../../hooks/useAuth";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isSuccess, data } = useUserLogin();
  const {
    mutateAsync: loginWithGoogleMutate,
    data: googleLoginData,
    isSuccess: isGoogleLoginSuccess,
  } = useUserGoogleLogin();
  const { setUser } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$-])[A-Za-z\d@_$-]{8,}$/,
          "Must contain uppercase, lowercase, number, and special character (@, _, $, -)"
        )
        .required("Required"),
    }),
    onSubmit: async (values) => {
      await mutateAsync({
        email: values.email,
        password: values.password,
      });
    },
  });

  if (isSuccess) {
    navigate("/");
    localStorage.setItem("user", JSON.stringify(data.user));
    toast.success(data.message);
    setUser(data.user);
  }

  const handleLoginSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      await loginWithGoogleMutate(credential);
    } catch (error) {
      console.error("error with google login", error);
    }
  };

  if (isGoogleLoginSuccess) {
    navigate("/");
    localStorage.setItem("user", JSON.stringify(googleLoginData.user));
    toast.success(googleLoginData.message);
    setUser(googleLoginData.user);
  }

  return (
    <section className=" bg-secondary dark:bg-secondary-dark py-4">
      <div className="container m-auto p-2 sm:p-4 md:p-8 flex justify-center items-center bg-secondary dark:bg-secondary-dark min-h-screen">
        <div className="w-full max-w-2xl bg-white dark:bg-black rounded-2xl  shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-accent-dark/10">
          {/* Visual Header with Gift-themed Gradient */}
          <div className="relative bg-gradient-to-r from-primary/90 to-accent/90 dark:from-primary-dark/90 dark:to-accent-dark/90 p-8 text-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <Gift className="text-white w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-light">
                Unwrap Joy, One Gift at a Time
              </h1>
              <p className="text-white/95 dark:text-light/80 mt-3 text-lg">
                Sign in to discover thoughtful surprises for every celebration
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* Decorative Elements */}
            <div className="flex justify-center mb-6 relative">
              <div className="w-16 h-1 bg-primary dark:bg-primary-dark rounded-full"></div>
            </div>
            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="font-medium text-dark dark:text-light mb-2 flex items-center"
                >
                  <Mail className="text-accent dark:text-accent-dark w-5 h-5 me-2" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      formik.errors.email && formik.touched.email
                        ? "border-red-500"
                        : "border-gray-200 dark:border-secondary-dark/100 focus:border-accent dark:focus:border-accent-dark"
                    } bg-white dark:bg-black/80 text-dark dark:text-light focus:ring-0 focus:outline-none transition-all`}
                    placeholder="email@gmail.com"
                  />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <CircleAlert className="h-4 w-4 me-2" />

                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="font-medium text-dark dark:text-light mb-2 flex items-center"
                >
                  <LockKeyhole className="text-accent dark:text-accent-dark w-5 h-5 me-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      formik.errors.password && formik.touched.password
                        ? "border-red-500"
                        : "border-gray-200 dark:border-secondary-dark/100 focus:border-accent dark:focus:border-accent-dark"
                    } bg-white dark:bg-black/80 text-dark dark:text-light focus:ring-0 focus:outline-none transition-all`}
                    placeholder="••••••••"
                  />
                </div>
                {formik.errors.password && formik.touched.password && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <CircleAlert className="h-4 w-4 me-2" />

                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Password Strength Meter */}
              <div className="bg-secondary/30 dark:bg-secondary-dark/30 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <CircleAlert className="text-accent dark:text-accent-dark me-2 w-5 h-5" />
                  <span className="text-sm font-medium text-dark dark:text-light">
                    Password Requirements
                  </span>
                </div>
                <ul className="text-xs text-dark/80 dark:text-light/80 space-y-1">
                  <li
                    className={`flex items-center ${
                      formik.values.password.length >= 8 ? "text-green-500" : ""
                    }`}
                  >
                    {formik.values.password.length >= 8 ? (
                      <CircleCheck className="me-1 h-4 w-4 fill-green-500 text-white dark:fill-green-600" />
                    ) : (
                      <X className="w-4 h-4 me-2 text-gray-700" />
                    )}
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${
                      /[A-Z]/.test(formik.values.password)
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {/[A-Z]/.test(formik.values.password) ? (
                      <CircleCheck className="me-1 h-4 w-4 fill-green-500 text-white dark:fill-green-600" />
                    ) : (
                      <X className="w-4 h-4 me-2 text-gray-700" />
                    )}
                    At least one uppercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /[a-z]/.test(formik.values.password)
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {/[a-z]/.test(formik.values.password) ? (
                      <CircleCheck className="me-1 h-4 w-4 fill-green-500 text-white dark:fill-green-600" />
                    ) : (
                      <X className="w-4 h-4 me-2 text-gray-700" />
                    )}
                    At least one lowercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /\d/.test(formik.values.password) ? "text-green-500" : ""
                    }`}
                  >
                    {/\d/.test(formik.values.password) ? (
                      <CircleCheck className="me-1 h-4 w-4 fill-green-500 text-white dark:fill-green-600" />
                    ) : (
                      <X className="w-4 h-4 me-2 text-gray-700" />
                    )}
                    At least one number
                  </li>
                  <li
                    className={`flex items-center ${
                      /(?=.*[@_$-])/.test(formik.values.password)
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {/(?=.*[@_$-])/.test(formik.values.password) ? (
                      <CircleCheck className="me-1 h-4 w-4 fill-green-500 text-white dark:fill-green-600" />
                    ) : (
                      <X className="w-4 h-4 me-2 text-gray-700" />
                    )}
                    At least one special character (@, _, $ or -)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <LoadingButton
                loading={isPending}
                type="submit"
                disabled={!formik.isValid || !formik.dirty || isPending}
                className={`w-full mb-4 bg-gradient-to-r from-primary to-accent dark:from-primary-dark dark:to-accent-dark hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-primary/30 dark:hover:shadow-primary-dark/30 relative overflow-hidden group ${
                  !formik.isValid || !formik.dirty || isPending
                    ? " disabled:cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {/* Animated background */}
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary dark:from-accent-dark dark:to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  <KeyRound className="me-2 w-5 h-5" />
                  Login
                </span>
              </LoadingButton>
            </form>
            {/* Google Login Box */}
            <div className="w-full sm:w-4/12 md:4/12 mx-auto">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log("Login Failed with google")}
                text="signin_with"
                logo_alignment="center"
              />
            </div>
            {/* register Link */}
            <div className="mt-8 text-center">
              <p className=" text-dark/80 dark:text-light/80">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-accent dark:text-accent-dark hover:underline transition-colors"
                >
                  Craete a new account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
