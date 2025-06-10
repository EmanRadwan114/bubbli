import { Outlet, useLocation } from "react-router";
import Navbar from "./../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import VerifyPhone from "../../components/VerifyPhone/VerifyPhone";

export default function Layout() {
  const path = useLocation().pathname;

  return (
    <>
      {path.includes("login") || path.includes("register") ? null : (
          <Navbar></Navbar>
      )}
<<<<<<< HEAD
      <VerifyPhone></VerifyPhone>
      <Outlet></Outlet>
=======
      <div className="pt-16">
        <Outlet></Outlet>
      </div>
>>>>>>> 2f730a39a7d75bf4c38c73ab7037c5a4755ad7d7
      {path.includes("login") || path.includes("register") ? null : (
        <Footer></Footer>
      )}
    </>
  );
}
