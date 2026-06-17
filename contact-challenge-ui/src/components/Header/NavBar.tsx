import React from "react";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  children: React.ReactNode;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const NavBar = ({ children, activeNav, setActiveNav }: NavBarProps) => {
  const navigate = useNavigate();

  const handleClick = (nav: string, path: string) => {
    setActiveNav(nav);
    navigate(path);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold">Contact Manager</h1>
        </div>

        {/* Menu */}
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => handleClick("contacts", "/")}
                className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-100 ${
                  activeNav === "contacts" ? "bg-gray-100 font-medium" : ""
                }`}
              >
                👥 <span className="ml-3">Contacts</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleClick("activities", "/activities")}
                className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-100 ${
                  activeNav === "activities" ? "bg-gray-100 font-medium" : ""
                }`}
              >
                📅 <span className="ml-3">Activities</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
};
