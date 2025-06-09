// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

// ^ react query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ^ routing imports
import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";

import Layout from "./pages/Layout/Layout";
import Home from "./pages/Home/Home";
const AboutComponent = lazy(() => import("../src/pages/About/About.jsx"));
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
const ContactsComponent = lazy(() =>
  import("../src/pages/Contact/Contact.jsx")
);
const ProfileComponent = lazy(() => import("../src/pages/Profile/Profile.jsx"));
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails.jsx";
import DashboardHome from "./pages/DashboardHome/DashboardHome";
import DashboardCategories from "./pages/DashboardCategories/DashboardCategories";
import DashboardOrders from "./pages/DashboardOrders/DashboardOrders";
import DashboardProducts from "./pages/DashboardProducts/DashboardProducts";
import DashboardCoupons from "./pages/DashboardCoupons/DashboardCoupons";
import DashboardAdmins from "./pages/DashboardAdmins/DashboardAdmins";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";

// ^ routing setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ^ main site
      { index: true, element: <Home></Home> },
      { path: "home", element: <Home></Home> },
      {
        path: "about",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AboutComponent />
          </Suspense>
        ),
      },
      {
        path: "contacts",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactsComponent />
          </Suspense>
        ),
      },
      {
        path: "refundPolicy",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RefundPolicy />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfileComponent />
          </Suspense>
        ),
      },
      { path: "login", element: <Login></Login> },
      { path: "register", element: <Register></Register> },
      { path: "wishlist", element: <Wishlist></Wishlist> },
      { path: "cart", element: <Cart></Cart> },
      { path: "checkout", element: <Checkout></Checkout> },
      {
        path: "order-confirmation",
        element: <OrderConfirmation></OrderConfirmation>,
      },
      { path: "gifts", element: <Products></Products> },
      { path: "gifts/:id", element: <ProductDetails></ProductDetails> },

      // ^ dashboard
      {
        path: "dashboard",
        element: <Dashboard></Dashboard>,
        children: [
          {
            index: true,
            element: <DashboardHome></DashboardHome>,
          },
          {
            path: "categories",
            element: <DashboardCategories></DashboardCategories>,
          },
          {
            path: "gifts",
            element: <DashboardProducts></DashboardProducts>,
          },
          { path: "coupons", element: <DashboardCoupons></DashboardCoupons> },
          { path: "orders", element: <DashboardOrders></DashboardOrders> },
          { path: "admins", element: <DashboardAdmins></DashboardAdmins> },
        ],
      },
      { path: "*", element: <NotFound></NotFound> },
    ],
  },
]);

// ^ react query & redux setup
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ToastContainer } from "react-toastify";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            className="capitalize"
          />
        </QueryClientProvider>
      </AuthContextProvider>
    </Provider>
  </GoogleOAuthProvider>

  /* </StrictMode> */
);
