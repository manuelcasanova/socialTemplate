import { useState, useEffect, useRef } from "react"
import { axiosPrivate } from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";

//Components 
import Error from "../Error";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";


//Translation
import { useTranslation } from 'react-i18next';


export default function CreateRole({ onRoleCreated, isNavOpen, error, setError }) {

  const { t } = useTranslation();
  const { auth } = useAuth()
  const userId = auth.userId;
  const inputRef = useRef(null);
  const [newRoleName, setNewRoleName] = useState("")
  const [listedForAll, setListedForAll] = useState(true);
  // console.log('listedForAll', listedForAll)
  const [showInput, setShowInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false)

  const handleShowInfoMessage = () => {
    setShowInfoMessage(prev => !prev)
  }

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
    const roleNameRegex = /^[A-Za-z0-9 _.-]{1,25}$/;


    if (!trimmedName) {
      setErrorMessage(t('adminRoles.roleNameRequired'));
      return;
    }

    if (!roleNameRegex.test(trimmedName)) {
      setErrorMessage(t('adminRoles.roleNameRegex'));
      return;
    }

    try {
      const response = await axiosPrivate.post("/custom-roles-private", { role_name: trimmedName, userId: userId, listedForAll: listedForAll });

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
      } else if (error.message === 'Network Error') {
        setError('Network Error')
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  return (
    <>
      {!showInput &&
        <button
          className="button-white"
          style={{ alignSelf: 'start', marginTop: '1em' }}
          onClick={handleShowInput}
        >
          {t('adminRoles.createRole')}
        </button>}
      {showInput &&
        <div className="create-role-row"
          style={{ marginTop: '2em', marginBottom: '0px' }}
        >
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
          <div className="trust-device"
            style={{ marginTop: '1em', marginLeft: '1em', display: 'flex', flexDirection: 'row', alignItems: "center" }}
          >
            <input
              type="checkbox"
              id="persist"
              checked={listedForAll}
              onChange={(e) => {
                if (e.target.checked) {
                  setListedForAll(true);
                } else {
                  setListedForAll(false);
                }
              }}
            />
            <label htmlFor="persist">{t('adminRoles.button.setListedForAll')}</label>
            <div
              onClick={handleShowInfoMessage}
              className='info-button'>i</div>
          </div>

          {showInfoMessage &&
            // <div className='info-message' style={{ marginBottom: '1em' }}>
            <div className="admin-setup-note"
              style={{ color: 'gray', fontSize: '0.85em', marginLeft: '1em', display: 'flex', alignItems: 'center' }}>
              {t('adminRoles.button.setListedForAllInfo')}</div>}

          <button
            className="button-white button-smaller"
            onClick={handleCreateRole}
            disabled={!newRoleName.trim()}
            style={{
              opacity: !newRoleName.trim() ? 0.5 : 1,
              cursor: !newRoleName.trim() ? "not-allowed" : "pointer"
            }}
          >
            {t('adminRoles.create')}
          </button>
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