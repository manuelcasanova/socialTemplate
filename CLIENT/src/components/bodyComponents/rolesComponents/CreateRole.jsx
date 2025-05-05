import { useState, useEffect, useRef } from "react"
import { axiosPrivate } from "../../../api/axios";


export default function CreateRole({ onRoleCreated }) {

  const inputRef = useRef(null);
  const [newRoleName, setNewRoleName] = useState("")
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);


  const handleShowInput = () => {
    setShowInput(prev => !prev)
    setNewRoleName("");
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      const response = await axiosPrivate.post("/roles", { role_name: newRoleName.trim() });

      // Call the callback to update the parent state
      if (onRoleCreated) {
        onRoleCreated(response.data);
      }
      setNewRoleName("");
      setShowInput(false);
    } catch (error) {
      console.error("Error creating role:", error);
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
          >Create</button>
          <button
            className="button-red button-smaller"
            onClick={handleShowInput}
          >X</button>
        </div>
      }
    </>
  )
}

// 