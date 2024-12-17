import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../../css/FilterAdminUsers.css'


export default function FilterAdminUsers({ roles, setFilters }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // Role filter
  const [isActive, setIsActive] = useState(""); // Active status filter
  const [userId, setUserId] = useState(""); // ID filter
  const [email, setEmail] = useState(""); // Email filter
  const [isVisible, setIsVisible] = useState(false);

  // Function to update filters whenever any filter value changes
  const handleFilterChange = () => {
    setFilters({
      username,
      role,
      is_active: isActive === "" ? undefined : isActive, // Handle undefined when no filter is set
      user_id: userId || undefined, // Set filter if userId is not empty
      email: email || undefined // Set filter if email is not empty
    });
  };

  // Trigger the filter change whenever any input is updated
  useEffect(() => {
    handleFilterChange();
  }, [username, role, isActive, userId, email]); // Dependencies for triggering filter change

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

          {/* ID filter */}
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          {/* Username filter */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Email filter */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Role filter */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All Roles</option>
            {roles.map((r, idx) => (
              <option key={idx} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Active status filter */}
          <select value={isActive} onChange={(e) => setIsActive(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}
    </div>  
  );
}
