import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Hooks
import { axiosPrivate } from "../../../api/axios";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";

// Util functions
import { fetchRoles } from "./fetchRoles";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";

// Components
import Error from "../Error";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import CreateRole from "./CreateRole";

//Styling
import '../../../css/AdminRoles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faWarning, faInfo } from "@fortawesome/free-solid-svg-icons";

//Translation
import { useTranslation } from 'react-i18next';


export default function AdminRoles({ isNavOpen, customRoles, setCustomRoles }) {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const userId = auth.userId;
  const [systemRoles, setSystemRoles] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [regexError, setRegexError] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editRoleId, setEditRoleId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const inputRef = useRef(null);
  const [showInput, setShowInput] = useState(false)
  const roleNameRegex = /^[A-Za-z0-9 _-]{1,25}$/;
  const [showCustomRolesInfo, setCustomRolesInfo] = useState(false);

  const handleShowCustomRolesInfo = () => {
    setCustomRolesInfo(prev => !prev)
  }

  useEffect(() => {
    if (editRoleId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editRoleId]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/custom-roles-public');
        setCustomRoles(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch customRoles');
        setCustomRoles(null);
      } finally {
        setIsLoading(false);
      }
    };

    getRoles();
  }, []);

  const handleDeleteRole = async () => {
    if (!confirmDeleteId) return;

    try {
      setIsLoading(true);

      // Make the DELETE request
      const response = await axiosPrivate.delete(`/custom-roles-private/${confirmDeleteId}?userId=${userId}`);

      // Check if response status is 204 (No Content)
      if (response.status === 204) {
        // After successful deletion, update the state and handle the error message
        setCustomRoles(prevRoles =>
          prevRoles.filter(role => role.role_id !== confirmDeleteId)
        );

        // Reset the confirmation and active menu
        setConfirmDeleteId(null);
        setActiveMenuId(null);

        // Clear error when deletion is successful
        setError(null);  // Reset error state in case it was used elsewhere
      } else {
        // Handle unexpected responses
        setError("Failed to delete role.");
      }
    } catch (error) {
      console.error("Error deleting role:", error);

      // Set error message based on the error response
      if (error.response?.data?.message) {
        setError(error.response.data.message); // Use setError here
      } else if (error.message === 'Network Error') {
        setError('Network Error');  // Use setError here
      } else {
        setError("An unexpected error occurred.");  // Use setError here
      }
    } finally {
      setIsLoading(false);
    }
  };









  const handleEditRole = async () => {
    const trimmedName = roleName.trim();

    if (!trimmedName || !editRoleId) {
      setError("Role name cannot be empty.");
      return;
    }

    if (!roleNameRegex.test(trimmedName)) {
      // Instead of setError, just display the message
      setRegexError("Role name must be 1-25 characters and can include letters, numbers, spaces, hyphens, and underscores.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosPrivate.put(`/custom-roles-private/${editRoleId}`, {
        role_name: trimmedName,
        userId: userId
      });

      const updatedRole = response.data;

      // Update local state
      setCustomRoles(prevRoles =>
        prevRoles.map(role =>
          role.role_id === updatedRole.role_id ? updatedRole : role
        )
      );

      setEditRoleId(null);
      setActiveMenuId(null);
      setRoleName('');
      setError(null);
      setErrorMessage("");
      setRegexError(null);
    } catch (error) {
      console.error("Error updating role:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setError('Network Error')
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRoles();
        setSystemRoles(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch systmRoles");
        setSystemRoles(null);
      } finally {
        setIsLoading(false);
      }
    };

    getRoles();
  }, []);

  const handleRoleCreated = (newRole) => {
    setCustomRoles((prevRoles) =>
      [...prevRoles, newRole].sort((a, b) => a.role_name.localeCompare(b.role_name))
    );
  };



  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-roles">
        <h2>{t('adminRoles.title')}</h2>
        {isLoading && <LoadingSpinner />}

        {(superAdminSettings.allowAdminCreateCustomRole || isSuperAdmin) &&
          <CreateRole onRoleCreated={handleRoleCreated} isNavOpen={isNavOpen} error={error} setError={setError} />
        }

        <div className="custom-roles-title">
          <h3>{t('adminRoles.customRoles')}</h3>
          <FontAwesomeIcon
            className="fa-info"
            icon={faInfo}
            onClick={() =>
              handleShowCustomRolesInfo()
            }
          />
        </div>
        {showCustomRolesInfo &&
          <h4>
            {t('adminRoles.customRolesInfo')}
          </h4>
        }


        {(customRoles === null || customRoles.length === 0) && (
          <div style={{ marginTop: '0.5em', marginBottom: '0.5em' }}>
            {t('adminRoles.noCustomRoles')}{' '}
            {superAdminSettings.allowAdminCreateCustomRole && t('adminRoles.createOne')}
          </div>
        )}

        <button
          className="button-white"
          style={{ alignSelf: 'start', marginTop: '1em' }}
          onClick={() => navigate(`/admin/superadmin/roleadminhistory`)}
        >{t('adminRoles.accessRoleAdministrationHistory')}</button>


        {!isLoading && !error && customRoles && (
          <ul>
            {customRoles
              .filter(role => !role.is_system_role)
              .map(role => (
                <li className="admin-roles-line" key={role.role_id}>


                  {
                    (superAdminSettings.allowAdminEditCustomRole || superAdminSettings.allowAdminDeleteCustomRole || isSuperAdmin) &&
                    (role.created_by === userId || isSuperAdmin) && (
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => {
                          setActiveMenuId(prev => (prev === role.role_id ? null : role.role_id));
                          setConfirmDeleteId(null);
                          setEditRoleId(null);
                        }}
                      />
                    )
                  }


                  {(superAdminSettings.allowAdminEditCustomRole || isSuperAdmin) && <>
                    {editRoleId === role.role_id && (
                      <div style={{ marginRight: '5px' }}>Edit role name</div>
                    )}
                  </>}

                  {editRoleId !== role.role_id && (
                    <div style={{ marginRight: '5px' }}>{role.role_name}</div>
                  )}


                  {activeMenuId === role.role_id && (
                    <>

                      {
                        (superAdminSettings.allowAdminEditCustomRole || isSuperAdmin) &&

                        editRoleId !== role.role_id && confirmDeleteId !== role.role_id && (
                          <button
                            className="button-white button-smaller"
                            onClick={() => setEditRoleId(role.role_id)}
                          >
                            {t('adminRoles.button.edit')}
                          </button>
                        )}

                      {
                        (superAdminSettings.allowAdminEditCustomRole || isSuperAdmin) &&
                        editRoleId === role.role_id && (
                          <div>
                            <input
                              type="text"
                              autoComplete="off"
                              ref={inputRef}
                              onChange={(e) => setRoleName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditRole();
                                }
                              }}
                              value={roleName}
                              placeholder={`${role.role_name}`}
                              required
                            />
                            <button
                              onClick={handleEditRole}
                              className="button-white button-smaller"
                              disabled={!roleName.trim()}
                            >
                              {t('adminRoles.button.ok')}
                            </button>
                            <button
                              onClick={() => {
                                setEditRoleId(null);
                                setActiveMenuId(null);
                                setRegexError(null);
                                setErrorMessage("");
                                setRoleName("");
                              }}

                              className="button-red button-smaller"
                            >
                              x
                            </button>

                            {errorMessage && (
                              <p style={{ color: 'red' }}>{errorMessage}</p>

                            )}

                          </div>
                        )}

                      {
                        (superAdminSettings.allowAdminDeleteCustomRole || isSuperAdmin) &&

                        confirmDeleteId !== role.role_id && editRoleId !== role.role_id && (
                          <button
                            className="button-red button-smaller"
                            onClick={() => setConfirmDeleteId(role.role_id)}
                          >
                            {t('adminRoles.button.delete')}
                          </button>
                        )}

                      {
                        (superAdminSettings.allowAdminDeleteCustomRole || isSuperAdmin) &&
                        confirmDeleteId === role.role_id && (
                          <div className="confirm-delete-role">

                            <FontAwesomeIcon
                              icon={faWarning}
                              style={{ marginLeft: '1em' }}
                            />
                            <div>
                              {t('adminRoles.warning')}
                            </div>
                            <button
                              className="button-red button-smaller"
                              onClick={handleDeleteRole}
                            >
                              {t('adminRoles.button.confirmDelete')}
                            </button>
                            <button
                              className="button-white button-smaller"
                              onClick={() => {
                                setConfirmDeleteId(null);
                                setActiveMenuId(null);
                              }}
                            >
                              x
                            </button>
                          </div>
                        )}
                    </>
                  )}
                </li>

              ))}
          </ul>
        )}


        {regexError && (
          <p style={{ color: 'red', marginTop: '0.5em' }}>{regexError}</p>
        )}

        <h3>{t('adminRoles.systemRoles')}</h3>
        {!isLoading && !error && systemRoles && (
          <ul>
            {systemRoles
              .map(role => (
                <li className="admin-roles-line" key={role}>{role}</li>
              ))}
          </ul>
        )}

      </div>
    </div>
  );
}
