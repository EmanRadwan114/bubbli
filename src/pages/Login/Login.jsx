import { useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "./../../components/LoadingButton/LoadingButton";
import { CircleAlert, Gift, KeyRound, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUserGoogleLogin, useUserLogin } from "../../hooks/useAuth";
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

  // ✅ Handle normal login success
  useEffect(() => {
    if (isSuccess && data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      toast.success(data.message);
    }
  }, [isSuccess, data, setUser, navigate]);

  // ✅ Handle Google login success
  useEffect(() => {
    if (isGoogleLoginSuccess && googleLoginData?.user) {
      localStorage.setItem("user", JSON.stringify(googleLoginData.user));
      setUser(googleLoginData.user);

      if (googleLoginData.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      toast.success(googleLoginData.message);
    }
  }, [isGoogleLoginSuccess, googleLoginData, setUser, navigate]);

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

  // ✅ Handle Google Sign-in Button Success
  const handleLoginSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      await loginWithGoogleMutate(credential);
    } catch (error) {
      console.error("error with google login", error);
    }
  };

  return (
    <section className="bg-secondary dark:bg-secondary-dark py-4">
      <div className="container m-auto p-2 sm:p-4 md:p-8 flex justify-center items-center bg-secondary dark:bg-secondary-dark min-h-screen">
        <div className="w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-accent-dark/10">
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

            {/* Login Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="font-medium text-dark dark:text-light mb-2 flex items-center">
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
                  className="font-medium text-dark dark:text-light mb-2 flex items-center">
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

              {/* Submit Button */}
              <LoadingButton
                loading={isPending}
                type="submit"
                disabled={!formik.isValid || !formik.dirty || isPending}
                className={`w-full mb-4 bg-gradient-to-r from-primary to-accent dark:from-primary-dark dark:to-accent-dark hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-primary/30 dark:hover:shadow-primary-dark/30 relative overflow-hidden group ${
                  !formik.isValid || !formik.dirty || isPending
                    ? "disabled:cursor-not-allowed"
                    : "cursor-pointer"
                }`}>
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

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-dark/80 dark:text-light/80">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-accent dark:text-accent-dark hover:underline transition-colors">
                  Create a new account
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
