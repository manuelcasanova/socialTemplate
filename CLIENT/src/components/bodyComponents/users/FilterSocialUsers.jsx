import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../../css/FilterAdminUsers.css'

export default function FilterSocialUsers({ setFilters }) {
  const [username, setUsername] = useState("");
  const [isVisible, setIsVisible] = useState(false);


  // Function to update filters whenever any filter value changes
  const handleFilterChange = () => {
    setFilters({
      username
    });
  };

  const toggleVisibility = () => {
    setIsVisible(prevState => !prevState)

  };

  // Handle the visibility toggle and clear filters when the panel is closed
  const handleToggleFilter = () => {
    if (isVisible) {
      // Clear the filters when the panel is closing
      setUsername("");
    }
    // Toggle the visibility
    toggleVisibility()
  };

  // Trigger the filter change whenever any input is updated
  useEffect(() => {
    // console.log("Applying Filters:", { username});
    handleFilterChange();
  }, [username]); // Dependencies for triggering filter change

  // Handle username change with validation
  const handleUsernameChange = (e) => {
    const input = e.target.value;
    const validUsername = input.replace(/[^a-zA-Z0-9-_^\s]/g, ''); // Remove invalid characters
    setUsername(validUsername);
  };


  return (
    <div className="filter-wrapper">
      <button
        className="filter-toggle"
        onClick={handleToggleFilter}
      >
        <FontAwesomeIcon icon={isVisible ? faTimes : faFilter} />
      </button>

      {isVisible && (
        <div className="filter-container">


          {/* Username filter */}
          <input
            type="text"
            className="filter-container-input-username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            pattern="[a-zA-Z0-9-_^\s]+" // Optional, prevents invalid submission
            title="Only letters, numbers, hyphens, underscores, carets, and spaces are allowed."
          />

        </div>
      )}
    </div>
  );
}
