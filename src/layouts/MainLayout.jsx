import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";

export const MainLayout = () => {
  return (
    <div className="h-screen bg-amber-300 text-black">
      <Sidebar />
      <Outlet />
    </div>
  );
};
