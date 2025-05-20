import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "./photo/logoagilenergy.jpg";
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
const AssistantPage = ({ user }) => {
  const [assignedChefs, setAssignedChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch assigned chefs when component mounts or when user changes
  useEffect(() => {
    if (user && user.uid) {
      fetchAssignedChefs();
    }
  }, [user]);

  const fetchAssignedChefs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch assigned chefs using the assistant's UID
      const response = await axios.get(
        `${b1}/users/${user.uid}/assigned-chefs`

      );
      setAssignedChefs(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch chefs");
      console.error("Error fetching chefs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="assistant-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <h2>Welcome, {user?.name || 'Assistant'}</h2>
        <button onClick={fetchAssignedChefs} disabled={loading}>
          {loading ? "Loading..." : "My Chefs"}
        </button>
        
        <div className="logout-icon" onClick={handleLogout}>
          <FaSignOutAlt className="red-icon" size={24} />
          <span>Logout</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Assistant Dashboard</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="user-info">
          <p>Email: {user?.email}</p>
          <p>UID: {user?.uid}</p>
        </div>

        <div className="chefs-list">
          <h2>Assigned Chefs</h2>
          {loading ? (
            <p>Loading chefs...</p>
          ) : assignedChefs.length > 0 ? (
            <table className="chefs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {assignedChefs.map((chef) => (
                  <tr key={chef.uid}>
                    <td>{chef.name}</td>
                    <td>{chef.email}</td>
                    <td>{chef.place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No chefs currently assigned to you</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;