import { Outlet, useLocation } from "react-router";
import Navbar from "./../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function Layout() {
  const path = useLocation().pathname;

  return (
    <>
      {path.includes("login") || path.includes("register") ? null : (
        <Navbar></Navbar>
      )}
      <div className="pt-16">
        <Outlet></Outlet>
      </div>
      {path.includes("login") || path.includes("register") ? null : (
        <Footer></Footer>
      )}
    </>
  );
}
