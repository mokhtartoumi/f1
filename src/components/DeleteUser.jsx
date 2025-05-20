import React, { useState } from "react";
import axios from "axios";
import "./DeleteUser.css";
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
const DeleteUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${b1}/users?email=${searchQuery}`
      );
      if (response.data.length > 0) {
        const user = response.data[0];
        setSearchResult(user);
        setError("");
      } else {
        setSearchResult(null);
        setError("User not found");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setError("Failed to search user");
    }
  };

  const handleDelete = async () => {
    if (searchResult) {
      try {
        const response = await axios.delete(
          `${b1}/users/${searchResult.id}`
        );
        alert("User deleted successfully: " + response.data.message);
        setSearchResult(null);
        setSearchQuery("");
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
      }
    } else {
      setError("No user selected");
    }
  };

  return (
    <div className="delete-user-container">
      <h2>Delete User</h2>

      <div className="search-section">
        <div className="search-input-container">
          <label htmlFor="email-search">Search by Email:</label>
          <input
            id="email-search"
            type="email"
            placeholder="Enter user email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={handleSearch} className="search-button">
          Search User
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {searchResult && (
        <div className="user-details-card">
          <h3>User Details</h3>
          <div className="user-details-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{searchResult.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{searchResult.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value role-badge">{searchResult.role}</span>
            </div>
            {searchResult.place && (
              <div className="detail-item">
                <span className="detail-label">Place:</span>
                <span className="detail-value">{searchResult.place}</span>
              </div>
            )}
            {searchResult.section && (
              <div className="detail-item">
                <span className="detail-label">Section:</span>
                <span className="detail-value">{searchResult.section}</span>
              </div>
            )}
            {searchResult.speciality && (
              <div className="detail-item">
                <span className="detail-label">Speciality:</span>
                <span className="detail-value">{searchResult.speciality}</span>
              </div>
            )}
            {searchResult.nationality && (
              <div className="detail-item">
                <span className="detail-label">Nationality:</span>
                <span className="detail-value">{searchResult.nationality}</span>
              </div>
            )}
          </div>

          <button onClick={handleDelete} className="delete-button">
            Confirm Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;