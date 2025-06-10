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
      <VerifyPhone></VerifyPhone>
      <Outlet></Outlet>
      {path.includes("login") || path.includes("register") ? null : (
        <Footer></Footer>
      )}
    </>
  );
}
