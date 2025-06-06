import { Outlet } from "react-router";
import AdminSideNav from "../../components/AdminSideNav/AdminSideNav";

export default function Dashboard() {
  return (
    <>
      <AdminSideNav></AdminSideNav>
      <Outlet></Outlet>
    </>
  );
}
