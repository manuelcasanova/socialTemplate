import { useEffect, useState } from "react";

// Util functions
import { fetchCustomRoles } from "./fetchRoles";

// Components
import Error from "../Error";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";

//Styling
import '../../../css/AdminRoles.css'

export default function AdminRoles({ isNavOpen }) {
  const [roles, setRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRoles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCustomRoles();
        setRoles(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch roles");
        setRoles(null);
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
        {!isLoading && !error && roles && (
          <ul>
            {roles
              .filter(role => !role.is_system_role)
              .map(role => (
                <li key={role.role_id}>{role.role_name}</li>
              ))}
          </ul>
        )}

        <h3>System Roles</h3>
        {!isLoading && !error && roles && (
          <ul>
            {roles
              .filter(role => role.is_system_role)
              .map(role => (
                <li key={role.role_id}>{role.role_name}</li>
              ))}
          </ul>
        )}

      </div>
    </div>
  );
}
