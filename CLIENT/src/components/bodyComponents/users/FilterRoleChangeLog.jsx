import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function FilterRoleChangeLog({ roles, setFilters }) {
  const [modifier, setModifier] = useState("");
  const [recipient, setRecipient] = useState("");
  const [modifierId, setModifierId] = useState(""); // New state for modifier ID
  const [recipientId, setRecipientId] = useState(""); // New state for recipient ID
  const [role, setRole] = useState("");
  const [actionType, setActionType] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isActionTypeOpen, setIsActionTypeOpen] = useState(false);


  // Refs to track dropdowns
  const roleDropdownRef = useRef(null);
  const actionTypeDropdownRef = useRef(null);

  // Function to update filters whenever any filter value changes
  const handleFilterChange = () => {
    setFilters({
      modifier,
      recipient,
      modifier_id: modifierId || undefined, // Include modifier_id in the filter
      recipient_id: recipientId || undefined, // Include recipient_id in the filter
      role: role || undefined, // Handle undefined when no filter is set
      action_type: actionType || undefined, // Handle undefined when no filter is set
    });
  };

  // Trigger the filter change whenever any input is updated
  useEffect(() => {
    handleFilterChange();
  }, [modifier, recipient, modifierId, recipientId, role, actionType]);

  // Validation for modifier (alphanumeric, hyphen, underscore, and spaces)
  const handleModifierChange = (e) => {
    const input = e.target.value;
    const validModifier = input.replace(/[^a-zA-Z0-9-_^\s]/g, ''); // Remove invalid characters
    setModifier(validModifier);
  };

  // Validation for recipient (alphanumeric, hyphen, underscore, and spaces)
  const handleRecipientChange = (e) => {
    const input = e.target.value;
    const validRecipient = input.replace(/[^a-zA-Z0-9-_^\s]/g, ''); // Remove invalid characters
    setRecipient(validRecipient);
  };

  // Validation for modifier ID (must be a positive integer or empty)
  const handleModifierIdChange = (e) => {
    const input = e.target.value;
    // Ensure input is a valid positive integer (greater than 0)
    if (/^[0-9]*$/.test(input) && (input === "" || parseInt(input) > 0)) {
      setModifierId(input);
    } else if (input === "") {
      setModifierId(""); // Allow empty input
    }
  };

  // Validation for recipient ID (must be a positive integer or empty)
  const handleRecipientIdChange = (e) => {
    const input = e.target.value;
    // Ensure input is a valid positive integer (greater than 0)
    if (/^[0-9]*$/.test(input) && (input === "" || parseInt(input) > 0)) {
      setRecipientId(input);
    } else if (input === "") {
      setRecipientId(""); // Allow empty input
    }
  };

  // Toggle role dropdown
  const toggleRoleDropdown = () => {
    setIsRoleOpen(!isRoleOpen);
    setIsActionTypeOpen(false); // Close action type dropdown when role dropdown is toggled
  };

  // Toggle action type dropdown
  const toggleActionTypeDropdown = () => {
    setIsActionTypeOpen(!isActionTypeOpen);
    setIsRoleOpen(false); // Close role dropdown when action type dropdown is toggled
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
          {/* Modifier filter */}
          <input
            type="text"
            className="filter-container-input-modifier"
            placeholder="Modifier Username"
            value={modifier}
            onChange={handleModifierChange}
          />

          {/* Modifier ID filter */}
          <input
            type="text"
            className="filter-container-input-modifier-id"
            placeholder="Modifier ID"
            value={modifierId}
            onChange={handleModifierIdChange}
          />

          {/* Recipient filter */}
          <input
            type="text"
            className="filter-container-input-recipient"
            placeholder="Recipient Username"
            value={recipient}
            onChange={handleRecipientChange}
          />

          {/* Recipient ID filter */}
          <input
            type="text"
            className="filter-container-input-recipient-id"
            placeholder="Recipient ID"
            value={recipientId}
            onChange={handleRecipientIdChange}
          />

          {/* Role filter (custom dropdown) */}
          <div
            className="custom-dropdown"
            ref={roleDropdownRef}
            onMouseLeave={() => setIsRoleOpen(false)} 
          >
            <div
              className="filter-container-select"
              onClick={toggleRoleDropdown}
            >
              {role || "All Roles"}
            </div>
            {isRoleOpen && roles.length > 0 && (
              <div className="custom-dropdown-menu">
                <div
                  className="custom-dropdown-option"
                  onClick={() => {
                    setRole(""); 
                    setIsRoleOpen(false); 
                  }}
                >
                  All Roles
                </div>

                {roles.map((r, idx) => (
                  <div
                    key={idx}
                    className="custom-dropdown-option"
                    onClick={() => {
                      setRole(r); 
                      setIsRoleOpen(false); 
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
            {isRoleOpen && roles.length === 0 && (
              <div className="custom-dropdown-menu">
                <div className="custom-dropdown-option">No roles available</div>
              </div>
            )}
          </div>

          {/* Action Type filter (custom dropdown) */}
          <div
            className="custom-dropdown"
            ref={actionTypeDropdownRef}
            onMouseLeave={() => setIsActionTypeOpen(false)}  
          >
            <div
              className="filter-container-select"
              onClick={toggleActionTypeDropdown}
            >
              {actionType || "All Actions"}
            </div>
            {isActionTypeOpen && (
              <div className="custom-dropdown-menu">
                <div
                  className="custom-dropdown-option"
                  onClick={() => {
                    setActionType(""); 
                    setIsActionTypeOpen(false); 
                  }}
                >
                  All Actions
                </div>
                <div
                  className="custom-dropdown-option"
                  onClick={() => {
                    setActionType("assigned");  
                    setIsActionTypeOpen(false); 
                  }}
                >
                  Assigned
                </div>
                <div
                  className="custom-dropdown-option"
                  onClick={() => {
                    setActionType("unassigned");  
                    setIsActionTypeOpen(false); 
                  }}
                >
                  Unassigned
                </div>
              </div>
            )}
            {isActionTypeOpen && (
              <div className="custom-dropdown-menu">
                {/* Show 'No actions available' if there are no options in the dropdown */}
                {["assigned", "unassigned"].length === 0 && (
                  <div className="custom-dropdown-option">No actions available</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
