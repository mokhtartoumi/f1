import React, { useState } from "react";
import axios from "axios";
import "./DeleteUser.css"; // Changed to use UpdateUser.css
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
const UserUpdate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");

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

  const handleUpdate = async (field) => {
    if (searchResult) {
      try {
        const response = await axios.put(
          `${b1}/users/${searchResult.id}`,
          { [field]: updatedValue }
        );
        alert("User updated successfully: " + response.data.message);
        setSearchResult({ ...searchResult, [field]: updatedValue });
        setEditingField(null);
        setUpdatedValue("");
      } catch (error) {
        console.error("Error updating user:", error);
        setError("Failed to update user");
      }
    } else {
      setError("No user selected");
    }
  };

  return (
    <div className="update-user-container">
      <h2>Update User</h2>

      {/* Search Section - Modified to stack vertically */}
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
              <div className="field-container">
                <span className="detail-value">{searchResult.name}</span>
                {editingField === "name" ? (
                  <div className="edit-controls">
                    <input
                      type="text"
                      value={updatedValue}
                      onChange={(e) => setUpdatedValue(e.target.value)}
                      placeholder="Enter new name"
                      className="edit-input"
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleUpdate("name")} className="save-button">
                        Save
                      </button>
                      <button onClick={() => setEditingField(null)} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setEditingField("name")} className="update-button">
                    Update
                  </button>
                )}
              </div>
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
                <div className="field-container">
                  <span className="detail-value">{searchResult.place}</span>
                  {editingField === "place" ? (
                    <div className="edit-controls">
                      <input
                        type="text"
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                        placeholder="Enter new place"
                        className="edit-input"
                      />
                      <div className="edit-buttons">
                        <button onClick={() => handleUpdate("place")} className="save-button">
                          Save
                        </button>
                        <button onClick={() => setEditingField(null)} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setEditingField("place")} className="update-button">
                      Update
                    </button>
                  )}
                </div>
              </div>
            )}

            {searchResult.section && (
              <div className="detail-item">
                <span className="detail-label">Section:</span>
                <div className="field-container">
                  <span className="detail-value">{searchResult.section}</span>
                  {editingField === "section" ? (
                    <div className="edit-controls">
                      <input
                        type="text"
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                        placeholder="Enter new section"
                        className="edit-input"
                      />
                      <div className="edit-buttons">
                        <button onClick={() => handleUpdate("section")} className="save-button">
                          Save
                        </button>
                        <button onClick={() => setEditingField(null)} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setEditingField("section")} className="update-button">
                      Update
                    </button>
                  )}
                </div>
              </div>
            )}

            {searchResult.speciality && (
              <div className="detail-item">
                <span className="detail-label">Speciality:</span>
                <div className="field-container">
                  <span className="detail-value">{searchResult.speciality}</span>
                  {editingField === "speciality" ? (
                    <div className="edit-controls">
                      <input
                        type="text"
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                        placeholder="Enter new speciality"
                        className="edit-input"
                      />
                      <div className="edit-buttons">
                        <button onClick={() => handleUpdate("speciality")} className="save-button">
                          Save
                        </button>
                        <button onClick={() => setEditingField(null)} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setEditingField("speciality")} className="update-button">
                      Update
                    </button>
                  )}
                </div>
              </div>
            )}

            {searchResult.nationality && (
              <div className="detail-item">
                <span className="detail-label">Nationality:</span>
                <div className="field-container">
                  <span className="detail-value">{searchResult.nationality}</span>
                  {editingField === "nationality" ? (
                    <div className="edit-controls">
                      <input
                        type="text"
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                        placeholder="Enter new nationality"
                        className="edit-input"
                      />
                      <div className="edit-buttons">
                        <button onClick={() => handleUpdate("nationality")} className="save-button">
                          Save
                        </button>
                        <button onClick={() => setEditingField(null)} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setEditingField("nationality")} className="update-button">
                      Update
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserUpdate;