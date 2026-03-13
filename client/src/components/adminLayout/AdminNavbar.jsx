import React from "react";
import { NavLink } from "react-router-dom";

const AdminNavbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-indigo-500 text-white px-4 py-2 rounded mb-3 flex items-center space-x-2"
      : "text-gray-700 hover:bg-gray-200 px-4 py-2 rounded mb-3 flex items-center space-x-2 transition";

  return (
    <aside className="bg-white w-64 min-h-screen p-6 shadow-lg">
      <h2 className="text-lg font-bold mb-6 text-gray-800">Menu</h2>
      <NavLink to="/admin" className={linkClass}>
        <span>🏠</span>
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/admin/students" className={linkClass}>
        <span>👨‍🎓</span>
        <span>Students</span>
      </NavLink>
      <NavLink to="/admin/courses" className={linkClass}>
        <span>📚</span>
        <span>Courses</span>
      </NavLink>
      <NavLink to="/admin/settings" className={linkClass}>
        <span>⚙️</span>
        <span>Settings</span>
      </NavLink>
    </aside>
  );
};

export default AdminNavbar;