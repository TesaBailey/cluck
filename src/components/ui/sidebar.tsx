import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isMobile = useMobile();

  const sidebarItems = [
    { name: "Dashboard", href: "/" },
    { name: "Chickens", href: "/chickens" },
    { name: "Coops", href: "/coops" },
    { name: "Cages", href: "/cages" },
    { name: "Egg Collection", href: "/egg-collection" },
    { name: "Feed", href: "/feed" },
    { name: "Health", href: "/health" },
    { name: "Finances", href: "/finances" },
    { name: "Reports", href: "/reports" },
    { name: "Users", href: "/users" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transition-transform transform-translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isMobile ? "block" : "hidden"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-bold">Farm Dashboard</span>
        <button
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <nav className="py-4">
        {sidebarItems.map((item) => (
          <Link
            to={item.href}
            key={item.name}
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              location.pathname === item.href ? "bg-gray-100 text-gray-900" : ""
            )}
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
