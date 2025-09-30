import { useState, useEffect, useCallback, useRef } from "react";
import { matchRoutes, useNavigate } from 'react-router-dom';

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling
import '../../../css/AdminUsers.css';

//Components

import FilterAdminUsers from "./FilterAdminUsers";
import FilterAdminUsersBulk from "./FilterAdminUsersBulk";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";

//Util functions
import { formatDate } from '../../bodyComponents/postsComponents/util_functions/formatDate'

//Translation
import { useTranslation } from 'react-i18next';

export default function AdminUsersBulk({ isNavOpen, allowedRoles, customRoles, profilePictureKey }) {


  //To conditional render style transform on th
  const isIOS = () => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };


  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const loggedInUser = auth.userId

  const { t, i18n } = useTranslation();
  const axiosPrivate = useAxiosPrivate();

  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const prevError = useRef(null);
  const [filters, setFilters] = useState({ is_active: true });
  const [expandedUserId, setExpandedUserId] = useState(null);

  const [showSystemRoles, setShowSystemRoles] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null);
  }, [filters]);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      setIsLoading(true)
      try {
        // Fetch users and roles
        const [usersResponse, rolesResponse] = await Promise.all([
          axiosPrivate.get(`/users/with-full-roles`, { params: filters }),
          axiosPrivate.get(`/roles/`) // Fetch roles via the server route
        ]);

        // console.log("usersResponse.data", usersResponse.data)

        setUsers(usersResponse.data); // Set user data
        setRoles(rolesResponse.data); // Set roles from the server
        prevError.current = null; // Clear previous error tracking
      } catch (err) {
        console.error("Error fetching users:", err);

        let errorMsg = t('adminUsers.errorFetching');
        if (err.response?.data?.error) {
          errorMsg += ` ${err.response.data.error}`;
        } else if (err.message) {
          errorMsg += ` ${err.message}`;
        }

        // Prevent redundant setState
        if (errorMsg !== prevError.current) {
          prevError.current = errorMsg;
          setError(errorMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, [
    filters
  ]);

  const handleRoleChange = useCallback(async (user, role, checked) => {
    try {
      let updatedRoles;

      if (checked) {
        // Assigning roles
        if (role === 'SuperAdmin') {
          // Make sure Admin is also added
          updatedRoles = [...new Set([...user.roles, 'SuperAdmin', 'Admin', 'Moderator', 'User_subscribed'])];
        } else if (role === 'Admin') {
          updatedRoles = [...new Set([...user.roles, 'Admin', 'Moderator', 'User_subscribed'])];
        } else {
          updatedRoles = [...new Set([...user.roles, role])];
        }
      } else {
        // Unassigning roles with dependency checks
        const stillHas = (r) => user.roles.includes(r);

        if (role === 'Admin' && stillHas('SuperAdmin')) {
          setError(t('usersController.cannotRemoveAdminWhileSuperadmin'));
          return;
        }

        if (role === 'Moderator' && (stillHas('Admin'))) {
          setError(t('usersController.cannotRemoveRoleWhileAdmin'));
          return;
        }

        if (role === 'User_subscribed' && (stillHas('Admin'))) {
          setError(t('usersController.cannotRemoveRoleWhileAdmin'));
          return;
        }

        // Proceed to remove the role
        updatedRoles = user.roles.filter(r => r !== role);
      }

      await axiosPrivate.put(`/users/${user.user_id}/roles`, {
        roles: updatedRoles,
        loggedInUser,
        language: i18n.language
      });

      // Update UI state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.user_id === user.user_id
            ? { ...u, roles: updatedRoles }
            : u
        )
      );
      prevError.current = null;
    } catch (error) {
      console.error("Error updating roles", error);
      const errorMsg = error?.response?.data?.error || error?.message || "Failed to update roles.";
      setError(errorMsg);
      prevError.current = errorMsg;
    }
  }, [loggedInUser, i18n.language, axiosPrivate]);

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">

        <h2>{t('adminUsers.bulkRoleEdit')}</h2>

        <FilterAdminUsersBulk
          isSuperAdmin={isSuperAdmin}
          roles={roles}
          customRoles={customRoles}
          setFilters={setFilters}
          setExpandedUserId={setExpandedUserId}

        />

        {isLoading && <LoadingSpinner />}

        {error && <div className="error-message">{error}</div>}

        <div className="table-container"
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>{t('adminUsers.username')}

                  <button
                    className="button-green button-smaller"
                    style={{ marginLeft: '1em' }}
                    onClick={() => setShowEmail(prev => !prev)}
                    aria-label={showEmail ? "Hide email column" : "Show email column"}
                  >
                    {showEmail ? '-' : '+'}
                  </button>

                </th>
                {showEmail && <th>{t('adminUsers.email')}</th>}

                {/* Always show custom roles */}
                {customRoles.map(custom => (
                  <th key={custom.role_id}
                    style={{
                      writingMode: 'vertical-rl',
                      transform: isIOS() ? 'none' : 'rotate(-180deg)',
                      direction: 'ltr',
                      whiteSpace: 'nowrap',
                      textAlign: 'left',
                      verticalAlign: 'middle',
                      paddingBottom: '10px',
                    }}
                  >{custom.role_name}</th>
                ))}

                {/* Show system roles only when toggled */}
                {showSystemRoles &&
                  roles
                    .filter(role => isSuperAdmin || role !== 'SuperAdmin')
                    .map(role => (
                      <th key={role}
                        style={{
                          writingMode: 'vertical-rl',
                          transform: isIOS() ? 'none' : 'rotate(-180deg)',
                          direction: 'ltr',
                          whiteSpace: 'nowrap',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                          paddingBottom: '10px',
                        }}
                      >{role}</th>
                    ))}
              </tr>
            </thead>

            <tbody>
              {users

                .filter(user => {
                  const isUserSuperAdmin = user.roles.includes('SuperAdmin');
                  if (isUserSuperAdmin && !superAdminSettings.showSuperAdminInUsersAdmin && !isSuperAdmin) {
                    return false;
                  }
                  if (!user.admin_visibility && user.user_id !== loggedInUser) {
                    return false;
                  }
                  return true;
                })

                .map(user => (
                  <tr key={user.user_id}>
                    <td>{user.username}</td>
                    {showEmail && <td>{user.email}</td>}

                    {/* Always show custom roles */}
                    {customRoles.map(custom => (
                      <td key={`${user.user_id}-${custom.role_id}`}>
                        <input
                          type="checkbox"
                          checked={user.roles.includes(custom.role_name)}
                          onChange={(e) => {
                            setError(null);  // Clear previous error immediately
                            handleRoleChange(user, custom.role_name, e.target.checked);
                          }}
                        />
                      </td>
                    ))}

                    {/* Conditionally show system roles */}
                    {showSystemRoles &&
                      roles
                        .filter(role => isSuperAdmin || role !== 'SuperAdmin')
                        .map(role => (
                          <td key={`${user.user_id}-${role}`}>
                            <input
                              type="checkbox"
                              checked={user.roles.includes(role)}
                              onChange={(e) => {
                                setError(null);
                                handleRoleChange(user, role, e.target.checked);
                              }}

                              disabled={!isSuperAdmin && role === 'SuperAdmin'}
                            />
                          </td>
                        ))}
                  </tr>

                ))}
            </tbody>
          </table>
          <button
            className="button-green button-smaller"
            style={{ height: '2em', width: '2em' }}
            onClick={() => setShowSystemRoles(prev => !prev)}
          >
            {showSystemRoles ? '-' : '+'}
          </button>
        </div>

      </div>
    </div>

  )
}