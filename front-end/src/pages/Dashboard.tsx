import Sidebar from "../components/Sidebar";
import CSS from "../styles/sidebar.module.css";
import { Outlet } from "react-router-dom";
export default function Dashboard() {

  return <div className={CSS.dashboard}>
    <Sidebar />
    <Outlet />
  </div>;
}
