import React from "react";
import "./CreateUser.css"; // Changed to CreateUser.css
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
const CreateUser = ({ formData, handleInputChange, createUser }) => {
  return (
    <div className="create-user-container"> {/* Changed class name */}
      <h2 className="create-user-title">Create User</h2> {/* Added specific class */}
      <div className="create-user-form"> {/* Added form wrapper */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="create-user-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="create-user-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="create-user-input"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="create-user-select"
        >
          <option value="chef">Chef</option>
          <option value="assistant">Assistant</option>
          <option value="technicien">Technicien</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === "chef" && (
          <input
            type="text"
            name="place"
            placeholder="Place (Country)"
            value={formData.place}
            onChange={handleInputChange}
            className="create-user-input"
          />
        )}

        {formData.role === "assistant" && (
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleInputChange}
            className="create-user-input"
          />
        )}

        {formData.role === "technicien" && (
          <input
            type="text"
            name="speciality"
            placeholder="Speciality"
            value={formData.speciality}
            onChange={handleInputChange}
            className="create-user-input"
          />
        )}

        {formData.role === "admin" && (
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="create-user-input"
          />
        )}

        <button 
          onClick={createUser}
          className="create-user-button"
        >
          Create User
        </button>
      </div>
    </div>
  );
};

export default CreateUser;