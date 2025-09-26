import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../../css/FilterAdminUsers.css'
//Translation
import { useTranslation } from 'react-i18next';

export default function FilterAdminUsersBulk({ roles, customRoles, setFilters, setExpandedUserId, isSuperAdmin }) {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // Role filter
  const [isActive, setIsActive] = useState(true); // Active status filter
  const [userId, setUserId] = useState(""); // ID filter
  const [email, setEmail] = useState(""); // Email filter
  const [isVisible, setIsVisible] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isActiveOpen, setIsActiveOpen] = useState(false);

  // Combine both into one array of role names
  const allRoles = [...roles, ...customRoles.map(role => role.role_name)];

  // console.log(allRoles);



  // Refs to track dropdowns
  const roleDropdownRef = useRef(null);
  const activeStatusDropdownRef = useRef(null);

  // Function to update filters whenever any filter value changes
  const handleFilterChange = () => {
    setFilters({
      username,
      role,
      is_active: isActive,
      user_id: userId || '', // Set filter if userId is not empty
      email: email || '' // Set filter if email is not empty
    });
  };

  const toggleVisibility = () => {
    setExpandedUserId(null);
    setIsVisible(prevState => !prevState)

  };

  // Handle the visibility toggle and clear filters when the panel is closed
  const handleToggleFilter = () => {
    if (isVisible) {
      // Clear the filters when the panel is closing
      setUsername("");
      setRole("");
      setUserId("");
      setEmail("");
      setIsActive(true);
    }
    // Toggle the visibility
    toggleVisibility()
  };

  // Trigger the filter change whenever any input is updated
  useEffect(() => {
    // console.log("Applying Filters:", { username, role, isActive, userId, email });
    handleFilterChange();
  }, [username, role, isActive, userId, email]); // Dependencies for triggering filter change

  // Handle username change with validation
  const handleUsernameChange = (e) => {
    const input = e.target.value;
    const validUsername = input.replace(/[^a-zA-Z0-9-_^\s]/g, ''); // Remove invalid characters
    setUsername(validUsername);
  };

  // Email validation for allowed characters (letters, numbers, @, ., -, _)
  const handleEmailChange = (e) => {
    const input = e.target.value;
    // Only allow letters, numbers, @, ., -, _
    const validEmail = input.replace(/[^a-zA-Z0-9@.\-_]/g, ''); // Remove invalid characters
    setEmail(validEmail);
  };

  // Toggle role dropdown, closing active status dropdown
  const toggleRoleDropdown = () => {
    setIsRoleOpen(!isRoleOpen);
    setIsActiveOpen(false); // Close active status dropdown
  };


  // Close dropdown if click is outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        roleDropdownRef.current && !roleDropdownRef.current.contains(e.target) &&
        activeStatusDropdownRef.current && !activeStatusDropdownRef.current.contains(e.target)
      ) {
        setIsRoleOpen(false);
        setIsActiveOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ensure isActive is set to true initially
  useEffect(() => {
    if (isActive === undefined) {
      setIsActive(true);
    }
  }, [])

  return (
    <div className="filter-wrapper">
      <button
        className="filter-toggle"
        onClick={handleToggleFilter}
      >
        <FontAwesomeIcon icon={isVisible ? faTimes : faFilter} />
      </button>

      {isVisible && (
        <div className="filter-container"
        >


          {/* Username filter */}
          <input
            type="text"
            className="filter-container-input-username"
            placeholder={t('filterAdmin.usernamePlaceholder')}
            value={username}
            onChange={handleUsernameChange}
            pattern="[a-zA-Z0-9-_^\s]+" // Optional, prevents invalid submission
            title="Only letters, numbers, hyphens, underscores, carets, and spaces are allowed."
          />

          {/* Email filter */}
          <input
            type="email"
            className="filter-container-input-email"
            placeholder={t('filterAdmin.emailPlaceholder')}
            value={email}
            onChange={handleEmailChange}
          />

          {/* Role filter (custom dropdown) */}
          <div
            className="custom-dropdown"
            ref={roleDropdownRef} // Reference to role dropdown
            onMouseLeave={() => setIsRoleOpen(false)} // Close on hover out
          >
            <div
              className="filter-container-select"
              onClick={toggleRoleDropdown} // Use the toggle function
            >
              {role || t('filterAdmin.allRoles')}
            </div>
            {isRoleOpen && roles.length > 0 && (
              <div className="custom-dropdown-menu"
                 
              style={{position: 'absolute', zIndex: '1000', border: '1px solid black'}}
              >
                {/* Add reset option for role */}
                <div
                  className="custom-dropdown-option"
                  onClick={() => {
                    setRole(""); // Reset the role filter
                    setIsRoleOpen(false); // Close the dropdown
                  }}
                >
                  {t('filterAdmin.allRoles')}
                </div>

                {allRoles
                  .filter(role => role !== 'SuperAdmin' || isSuperAdmin) // Only include 'SuperAdmin' if isSuperAdmin is true
                  .map((r, idx) => (
                    <div
                      key={idx}
                      className="custom-dropdown-option"
                      onClick={() => {
                        setRole(r); // Set selected role
                        setIsRoleOpen(false); // Close the dropdown
                      }}
                    >
                      {r}
                    </div>
                  ))}

              </div>
            )}
            {isRoleOpen && roles.length === 0 && (
              <div className="custom-dropdown-menu">
                <div className="custom-dropdown-option">{t('filterAdmin.noRoles')}</div>
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
}
