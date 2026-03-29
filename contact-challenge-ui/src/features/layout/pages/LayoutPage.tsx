import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from "../../../components/Header/NavBar";

export const LayoutPage = () => {
  const [activeNav, setActiveNav] = useState<string>("contacts");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/contacts")) {
      setActiveNav("contacts");
    } else if (location.pathname.startsWith("/activities")) {
      setActiveNav("activities");
    } else {
      setActiveNav("");
    }
  }, [location.pathname]);

  return (
    <div className="box-border w-full">
      <NavBar activeNav={activeNav} setActiveNav={setActiveNav}>
        <Outlet />
      </NavBar>
    </div>
  );
};
