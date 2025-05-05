import { useEffect, useState } from "react";

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
  const [showConfirmDelete, setShowConfirmDelete] = useState();
  const [showEdit, setShowEdit] = useState();
  const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);

  const handleShowConfirmDelete = () => {
    setShowConfirmDelete(prev => !prev)
  }
  const handleShowEdit = () => {
    setShowEdit(prev => !prev)
  }

  const handleDeleteRole = () => {
    console.log("Dummy - Delete role")
  }

  const handleEditRole = () => {
    console.log("Dummy - Edit role")
  }

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

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-roles">
        <h2>Admin Roles</h2>
        {isLoading && <LoadingSpinner />}
        {error && <Error message={error} />}


        <h3>Custom Roles</h3>

        <CreateRole />

        {!isLoading && !error && customRoles && (
          <ul>
            {customRoles
              .filter(role => !role.is_system_role)
              .map(role => (
                <li className="admin-roles-line" key={role.role_id}>

                  {showEdit && <div style={{ marginRight: '5px' }}>Edit role name</div>}

                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                    onClick={() => setShowEllipsisMenu(prev => !prev)}
                  />


                  {!showEdit &&
                    <div
                      style={{ marginRight: '5px' }}
                    >
                      {role.role_name}
                    </div>
                  }

                  {!showEllipsisMenu && (
                    <>

                      {!showEdit &&
                        <button
                          className="button-white button-smaller"
                          onClick={handleShowEdit}
                        >
                          Edit
                        </button>
                      }

                      {showEdit &&
                        <div>
                          <input
                            type="text"
                            // ref={inputRef}
                            autoComplete="off"
                            onChange={(e) => setRoleName(e.target.value)}
                            value={roleName}
                            placeholder={`${role.role_name}`}
                            required
                          />
                          <button
                            onClick={handleEditRole}
                            className="button-white button-smaller"
                          >OK</button>
                          <button
                            onClick={handleShowEdit}
                            className="button-red button-smaller"
                          >x</button>
                        </div>
                      }

                      {!showConfirmDelete && !showEdit &&
                        <button
                          className="button-red button-smaller"
                          onClick={handleShowConfirmDelete}
                        >Delete</button>
                      }

                      {showConfirmDelete &&
                        <div>
                          <button
                            className="button-red button-smaller"
                            onClick={handleDeleteRole}
                          >
                            Confirm delete
                          </button>
                          <button
                            className="button-white button-smaller"
                            onClick={handleShowConfirmDelete}
                          >x</button>

                        </div>
                      }

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
                <li className="admin-roles-line"  key={role}>{role}</li>
              ))}
          </ul>
        )}

      </div>
    </div>
  );
}
