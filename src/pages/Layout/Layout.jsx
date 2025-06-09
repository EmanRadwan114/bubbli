import { Outlet } from "react-router";
import Navbar from "./../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HomeHero from "../../components/HomeHero/HomeHero";

export default function Layout() {
  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
      <HomeHero></HomeHero>
    </>
  );
}
