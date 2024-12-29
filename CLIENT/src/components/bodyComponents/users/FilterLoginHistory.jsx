import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../../css/FilterAdminUsers.css';

export default function FilterLoginHistory({ setFilters }) {
  const [username, setUsername] = useState("");  // Username filter
  const [userId, setUserId] = useState("");      // User ID filter
  const [email, setEmail] = useState("");        // Email filter
  const [isVisible, setIsVisible] = useState(false); // Visibility toggle
  const [isActiveOpen, setIsActiveOpen] = useState(false); // Dropdown toggle for status filter

  // Handle the filter change whenever any input is updated
  const handleFilterChange = () => {
    setFilters({
      username,
      user_id: userId || undefined, // Set filter if userId is not empty
      email: email || undefined      // Set filter if email is not empty
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [username, userId, email]); // Dependencies for triggering filter change

  // Handle username change with validation
  const handleUsernameChange = (e) => {
    const input = e.target.value;
    const validUsername = input.replace(/[^a-zA-Z0-9-_^\s]/g, ''); // Remove invalid characters
    setUsername(validUsername);
  };

  // Handle userId change with validation
  const handleUserIdChange = (e) => {
    const input = e.target.value;
    // Ensure input is a valid positive integer (greater than 0)
    if (/^[0-9]*$/.test(input) && (input === "" || parseInt(input) > 0)) {
      setUserId(input);
    } else if (input === "") {
      setUserId(""); // Allow empty input
    }
  };

  // Email validation for allowed characters (letters, numbers, @, ., -, _)
  const handleEmailChange = (e) => {
    const input = e.target.value;
    // Only allow letters, numbers, @, ., -, _
    const validEmail = input.replace(/[^a-zA-Z0-9@.\-_]/g, ''); // Remove invalid characters
    setEmail(validEmail);
  };

  return (
    <div className="filter-wrapper">
      <button
        className="filter-toggle"
        onClick={() => setIsVisible(prevState => !prevState)}
      >
        <FontAwesomeIcon icon={isVisible ? faTimes : faFilter} />
      </button>

      {isVisible && (
        <div className="filter-container">
          {/* User ID filter */}
          <input
            type="number"
            className="filter-container-input-userid"
            placeholder="User ID"
            value={userId}
            onChange={handleUserIdChange}
          />

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

          {/* Email filter */}
          <input
            type="email"
            className="filter-container-input-email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
      )}
    </div>
  );
}
