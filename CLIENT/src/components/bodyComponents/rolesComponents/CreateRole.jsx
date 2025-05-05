import { useState, useEffect, useRef } from "react"


export default function CreateRole() {

  const inputRef = useRef(null);
  const [newRoleName, setNewRoleName] = useState("")
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);


  const handleShowInput = () => { setShowInput(prev => !prev) }

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
            placeholder='Aa'
            required
          />
          <button className="button-white button-smaller">Create</button>
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