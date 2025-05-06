import { useState, useEffect, useRef } from "react"
import { axiosPrivate } from "../../../api/axios";


export default function CreateRole({ onRoleCreated }) {

  const inputRef = useRef(null);
  const [newRoleName, setNewRoleName] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);


  const handleShowInput = () => {
    setShowInput(prev => !prev)
    setNewRoleName("");
    setErrorMessage("");
  }

  const handleCreateRole = async () => {

    const trimmedName = newRoleName.trim();
    const roleNameRegex = /^[A-Za-z0-9 _-]{1,25}$/;

    if (!trimmedName) {
      setErrorMessage("Role name is required.");
      return;
    }

    if (!roleNameRegex.test(trimmedName)) {
      setErrorMessage("Role name must be 1–25 characters and can only include letters, numbers, spaces, hyphens, and underscores.");
      return;
    }

    try {
      const response = await axiosPrivate.post("/custom-roles-private", { role_name: trimmedName });

      // Call the callback to update the parent state
      if (onRoleCreated) {
        onRoleCreated(response.data);
      }
      setNewRoleName("");
      setShowInput(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating role:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      {!showInput &&
        <button
          className="button-white margin-bottom-2em"
          style={{ alignSelf: 'start' }}
          onClick={handleShowInput}
        >
          Create role
        </button>}
      {showInput &&
        <div className="create-role-row">
          <input

            className="input-field"
            type="text"
            ref={inputRef}
            autoComplete="off"
            onChange={(e) => setNewRoleName(e.target.value)}
            value={newRoleName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateRole();
              }
            }}
            placeholder='Aa'
            required
          />
          <button
            className="button-white button-smaller"
            onClick={handleCreateRole}
            disabled={!newRoleName.trim()}
            style={{
              opacity: !newRoleName.trim() ? 0.5 : 1,
              cursor: !newRoleName.trim() ? "not-allowed" : "pointer"
            }}
          >Create</button>
          <button
            className="button-red button-smaller"
            onClick={handleShowInput}
          >X</button>
        </div>
      }

      {errorMessage && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

    </>
  )
}

// 