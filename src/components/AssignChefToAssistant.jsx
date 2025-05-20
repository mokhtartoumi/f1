import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeleteUser.css";

const AssignChefToAssistant = () => {
  const [assistants, setAssistants] = useState([]); // List of all assistants
  const [chefs, setChefs] = useState([]); // List of all chefs
  const [assignedChefIds, setAssignedChefIds] = useState([]); // Track globally assigned chef IDs
  const [selectedAssistant, setSelectedAssistant] = useState(""); // Selected assistant ID
  const [selectedChef, setSelectedChef] = useState(""); // Selected chef ID
  const [error, setError] = useState(""); // Error message
  const [assignedChefsForSelectedAssistant, setAssignedChefsForSelectedAssistant] = useState([]); // Chefs assigned to the selected assistant
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
  // Fetch all assistants, chefs, and globally assigned chefs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get(`${b1}/users`);
        const users = usersResponse.data;

        // Filter assistants and chefs
        const filteredAssistants = users.filter((user) => user.role === "assistant");
        const filteredChefs = users.filter((user) => user.role === "chef");

        setAssistants(filteredAssistants);
        setChefs(filteredChefs);

        // Fetch globally assigned chefs
        const assignedChefsResponse = await axios.get(`${b1}/assigned-chefs`);
        setAssignedChefIds(assignedChefsResponse.data.assignedChefIds);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // Fetch assigned chefs for the selected assistant
  useEffect(() => {
    if (selectedAssistant) {
      const fetchAssignedChefsForSelectedAssistant = async () => {
        try {
          const response = await axios.get(`${b1}/users/${selectedAssistant}`);
          const assistantData = response.data;
          setAssignedChefsForSelectedAssistant(assistantData.chefIds || []);
        } catch (error) {
          console.error("Error fetching assigned chefs for selected assistant:", error);
          setError("Failed to fetch assigned chefs for selected assistant");
        }
      };

      fetchAssignedChefsForSelectedAssistant();
    }
  }, [selectedAssistant]);

  // Handle assigning a chef to an assistant
  const handleAssignChef = async () => {
    if (!selectedAssistant || !selectedChef) {
      setError("Please select both an assistant and a chef");
      return;
    }

    try {
      const response = await axios.put(
        `${b1}/users/assign-chef/${selectedAssistant}`,
        { chefId: selectedChef }
      );
      alert(response.data.message);
      setError("");

      // Update the assigned chefs list for the selected assistant
      setAssignedChefsForSelectedAssistant((prevChefIds) => [...prevChefIds, selectedChef]);

      // Update the globally assigned chefs list
      setAssignedChefIds((prevAssignedChefIds) => [...prevAssignedChefIds, selectedChef]);
    } catch (error) {
      console.error("Error assigning chef:", error);
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Display backend error message
      } else {
        setError("Failed to assign chef");
      }
    }
  };

  // Filter out globally assigned chefs
  const availableChefs = chefs.filter((chef) => !assignedChefIds.includes(chef.id));

  return (
    <div className="form-container">
      <h2>Assign Chef to Assistant</h2>

      {/* Display error message if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Assistant Dropdown */}
      <div className="form-group">
        <label>Select Assistant:</label>
        <select
          value={selectedAssistant}
          onChange={(e) => setSelectedAssistant(e.target.value)}
        >
          <option value="">Select an assistant</option>
          {assistants.map((assistant) => (
            <option key={assistant.id} value={assistant.id}>
              {assistant.name} ({assistant.email})
            </option>
          ))}
        </select>
      </div>

      {/* Chef Dropdown */}
      <div className="form-group">
        <label>Select Chef:</label>
        <select
          value={selectedChef}
          onChange={(e) => setSelectedChef(e.target.value)}
        >
          <option value="">Select a chef</option>
          {availableChefs.map((chef) => (
            <option key={chef.id} value={chef.id}>
              {chef.name} ({chef.email})
            </option>
          ))}
        </select>
      </div>

      {/* Assign Button */}
      <button onClick={handleAssignChef}>Assign Chef</button>

      {/* Display assigned chefs for the selected assistant */}
      {selectedAssistant && (
        <div className="assigned-chefs">
          <h3>Assigned Chefs for Selected Assistant</h3>
          {assignedChefsForSelectedAssistant.length > 0 ? (
            <ul>
              {assignedChefsForSelectedAssistant.map((chefId) => {
                const chef = chefs.find((chef) => chef.id === chefId);
                return (
                  <li key={chefId}>
                    {chef ? `${chef.name} (${chef.email})` : `Chef ID: ${chefId}`}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No chefs assigned yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignChefToAssistant;