import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h1>Dashboard</h1>
        {/* Sidebar toggle button */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : <FaBars />} {/* Toggle between icons */}
        </button>
      </div>
      <ul>
        <li>
          <Link to="/students" onClick={toggleSidebar}>
            Students Page
          </Link>
        </li>
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
