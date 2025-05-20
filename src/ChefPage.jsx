import React from "react";
import { FaSignOutAlt, FaChartBar, FaClipboardList, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./chefPage.css";
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
const f1 = import.meta.env.VITE_frontend2_URL;


const ChefPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Navigation functions - now opening in new tab
  const navigateToCreateProblem = () => {
    const chefId = user?.id || "unknown";
    window.open(`${f1}/reportproblem?chefId=${chefId}`, '_blank');
  };

  const navigateToProblemStatus = () => {
    const chefId = user?.id || "unknown";
    window.open(`${f1}/problemlist?chefId=${chefId}`, '_blank');
  };

  return (
    <div className="chef-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2><FaUserCog className="icon" /> Chef Dashboard</h2>

        <div className="sidebar-menu">
          <button onClick={navigateToCreateProblem} className="active">
            <FaClipboardList className="icon" /> Report Problem
          </button>
          <button onClick={navigateToProblemStatus}>
            <FaChartBar className="icon" /> Problem Status
          </button>
          {/* Logout button moved here under Problem Status */}
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className="icon" /> Logout
          </button>
        </div>

        {/* User info at the bottom */}
        <div className="user-info">
          <div className="profile-section">
            <div className="avatar">{user?.name?.charAt(0) || "C"}</div>
            <div className="user-details">
              <h3>{user?.name || "Chef Name"}</h3>
              <p>{user?.email || "chef@example.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefPage;