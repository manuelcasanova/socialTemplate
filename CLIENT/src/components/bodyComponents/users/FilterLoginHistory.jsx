import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../../css/FilterAdminUsers.css';
//Translation
import { useTranslation } from 'react-i18next';

export default function FilterLoginHistory({ setFilters }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Visibility toggle

  // Handle the filter change whenever any input is updated
  const handleFilterChange = () => {
    setFilters({
      username,
      user_id: userId || undefined,
      email: email || undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      from_time: fromTime || undefined,
      to_time: toTime || undefined
    });
  };

  // Handle the visibility toggle and clear filters when the panel is closed
  const handleToggleFilter = () => {
    if (isVisible) {
      // Clear the filters when the panel is closing
      setUsername("");
      setUserId("");
      setEmail("");
      setFromDate("");
      setToDate("");
      setFromTime("");
      setToTime("");
    }
    // Toggle the visibility
    setIsVisible(prevState => !prevState);
  };

  useEffect(() => {
    handleFilterChange();
  }, [username, userId, email, fromDate, toDate, fromTime, toTime]);

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
        onClick={handleToggleFilter}
      >
        <FontAwesomeIcon icon={isVisible ? faTimes : faFilter} />
      </button>

      {isVisible && (
        <div className="filter-container">
          {/* User ID filter */}
          <input
            type="number"
            className="filter-container-input-userid"
            placeholder={t('filterLoginHistory.userId')}
            value={userId}
            onChange={handleUserIdChange}
          />

          {/* Username filter */}
          <input
            type="text"
            className="filter-container-input-username"
            placeholder={t('filterLoginHistory.username')}
            value={username}
            onChange={handleUsernameChange}
            pattern="[a-zA-Z0-9-_^\s]+" // Optional, prevents invalid submission
            title={t('filterLoginHistory.invalidUsername')}
          />

          {/* Email filter */}
          <input
            type="email"
            className="filter-container-input-email"
            placeholder={t('filterLoginHistory.email')}
            value={email}
            onChange={handleEmailChange}
          />

          {/* From Date filter */}
          <input
            type="date"
            className="filter-container-input-date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          {/* To Date filter */}
          <input
            type="date"
            className="filter-container-input-date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          {/* From Time filter */}
          <input
            type="time"
            className="filter-container-input-time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />

          {/* To Time filter */}
          <input
            type="time"
            className="filter-container-input-time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />

        </div>
      )}
    </div>
  );
}
