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
import { AuthContextProvider, AuthContext } from "./context/AuthContext.jsx";
import { OrdersContextProvider } from "./context/OrdersContext";
import CartContextProvider from "./context/CartContext";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";
import RequireAuth from "./components/Guards/RequireAuth.jsx";
import RequireAdmin from "./components/Guards/RequireAdmin.jsx";

// ^ react query & redux setup
import { ToastContainer } from "react-toastify";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./components/ArrowUp/ScrollToTop.jsx";
import WishlistContextProvider from "./context/Wishlist.Context.jsx";
const queryClient = new QueryClient();

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
        path: "contact",
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
      {
        path: "checkout",
        element: (
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        ),
      },
      {
        path: "order-confirmation/:id",
        element: (
          <RequireAuth>
            <OrderConfirmation />
          </RequireAuth>
        ),
      },
      {
        path: "gifts",
        children: [
          {
            // Handles /gifts (all products)
            index: true,
            element: <Products />,
          },
          {
            // Handles /gifts/:categoryName
            path: ":categoryName",
            element: <Products />,
          },
          {
            // Handles /gifts/:categoryName/:id
            path: ":categoryName/:id",
            element: <ProductDetails />,
          },
        ],
      },
      { path: "gifts/product/:id", element: <ProductDetails></ProductDetails> },

      // ^ dashboard
      {
        path: "dashboard",
        element: (
          <RequireAdmin>
            <Dashboard></Dashboard>
          </RequireAdmin>
        ),
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

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <OrdersContextProvider>
          <CartContextProvider>
            <WishlistContextProvider>
              <ScrollToTop />
              <RouterProvider router={router} />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                className="capitalize"
              />
            </WishlistContextProvider>
          </CartContextProvider>
        </OrdersContextProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  </GoogleOAuthProvider>

  /* </StrictMode> */
);
