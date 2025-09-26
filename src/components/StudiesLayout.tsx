import { Outlet } from "react-router";
import Analytics from "./Analytics";
import NavTabs from "./NavTabs";
import Navbar from "./Navbar";

function StudiesLayout() {
  return (
    <>
      <Navbar />
      <Analytics />
      <div className="w-10/12 mx-auto">
        <NavTabs />
        <Outlet />
      </div>
    </>
  );
}

export default StudiesLayout;
