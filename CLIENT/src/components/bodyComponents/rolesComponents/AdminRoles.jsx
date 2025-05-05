import { useEffect, useState, useRef } from "react";

//Hooks
import { axiosPrivate } from "../../../api/axios";

// Util functions
import { fetchCustomRoles, fetchRoles } from "./fetchRoles";

// Components
import Error from "../Error";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import CreateRole from "./CreateRole";

//Styling
import '../../../css/AdminRoles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export default function AdminRoles({ isNavOpen }) {
  const [customRoles, setCustomRoles] = useState(null);
  const [systemRoles, setSystemRoles] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editRoleId, setEditRoleId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const inputRef = useRef(null);
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    if (editRoleId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editRoleId]);
  
  const handleDeleteRole = async () => {
    if (!confirmDeleteId) return;
  
    try {
      setIsLoading(true);
  
      await axiosPrivate.delete(`/roles/${confirmDeleteId}`);
  
      // Remove from state
      setCustomRoles(prevRoles =>
        prevRoles.filter(role => role.role_id !== confirmDeleteId)
      );
  
      setConfirmDeleteId(null);
      setActiveMenuId(null);
      setError(null);
    } catch (error) {
      console.error("Error deleting role:", error);
      setError("Failed to delete the role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleEditRole = async () => {
    if (!roleName.trim() || !editRoleId) {
      setError("Role name cannot be empty.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      const response = await axiosPrivate.put(`/roles/${editRoleId}`, {
        role_name: roleName.trim(),
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
    } catch (error) {
      console.error("Error updating role:", error);
      setError("Failed to update the role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const getRoles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCustomRoles();
        setCustomRoles(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch customRoles");
        setCustomRoles(null);
      } finally {
        setIsLoading(false);
      }
    };

    getRoles();
  }, []);

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
    setCustomRoles((prevRoles) => [...prevRoles, newRole]);
  };

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-roles">
        <h2>Admin Roles</h2>
        {isLoading && <LoadingSpinner />}
        {error && <Error message={error} />}


        <h3>Custom Roles</h3>

        <CreateRole onRoleCreated={handleRoleCreated}/>

{customRoles.length === 0 && <div>There are no custom roles yet. Create one.</div>}

        {!isLoading && !error && customRoles && (
          <ul>
            {customRoles
              .filter(role => !role.is_system_role)
              .map(role => (
                <li className="admin-roles-line" key={role.role_id}>
                  {editRoleId === role.role_id && (
                    <div style={{ marginRight: '5px' }}>Edit role name</div>
                  )}

                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                    onClick={() =>
                      setActiveMenuId(prev => (prev === role.role_id ? null : role.role_id))
                    }
                  />

                  {editRoleId !== role.role_id && (
                    <div style={{ marginRight: '5px' }}>{role.role_name}</div>
                  )}

                  {activeMenuId === role.role_id && (
                    <>
                      {editRoleId !== role.role_id && (
                        <button
                          className="button-white button-smaller"
                          onClick={() => setEditRoleId(role.role_id)}
                        >
                          Edit
                        </button>
                      )}

                      {editRoleId === role.role_id && (
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
                          >
                            OK
                          </button>
                          <button
                            onClick={() => {
                              setEditRoleId(null);
                              setActiveMenuId(null);
                            }}

                            className="button-red button-smaller"
                          >
                            x
                          </button>
                        </div>
                      )}

                      {confirmDeleteId !== role.role_id && editRoleId !== role.role_id && (
                        <button
                          className="button-red button-smaller"
                          onClick={() => setConfirmDeleteId(role.role_id)}
                        >
                          Delete
                        </button>
                      )}

                      {confirmDeleteId === role.role_id && (
                        <div>
                          <button
                            className="button-red button-smaller"
                            onClick={handleDeleteRole}
                          >
                            Confirm delete
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

        <h3>System Roles</h3>
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
