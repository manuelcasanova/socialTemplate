import { useEffect, useState } from "react";

// Util functions
import { fetchCustomRoles } from "./fetchRoles";

// Components
import Error from "../Error";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";

export default function AdminRoles({ isNavOpen }) {
  const [roles, setRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRoles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCustomRoles();
        console.log("data", data)
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
      <div className="admin-users">
        <h2>Admin Roles</h2>
        {isLoading && <LoadingSpinner />}
        {error && <Error message={error} />}
        {/* {!isLoading && !error && roles && (
          <ul>
            {roles.map(role => (
              <li key={role.id}>{role.name}</li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
}
