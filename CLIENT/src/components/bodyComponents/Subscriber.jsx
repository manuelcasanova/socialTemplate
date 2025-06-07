import Footer from "../mainComponents/footer";
import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import Error from "./Error";

export default function Subscriber({ isNavOpen }) {
  const { auth } = useAuth();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [isSubscribed, setIsSubscribed] = useState(undefined);
  const [renewalDueDate, setRenewalDueDate] = useState(null)


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = auth?.userId;

  const getSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/users/subscriptions/status/${userId}`);

    if (typeof response.data === 'object' && response.data !== null) {
      setIsSubscribed(response.data.isActive);
      setRenewalDueDate(response.data.renewalDueDate);
    } else {
      // Fallback if response is just `false` or malformed
      setIsSubscribed(false);
    }
    } catch (error) {
      console.error("Error retrieving subscription status:", error);
      setError("Failed to retrieve subscription status. Please try again later.");
    } finally {
      setLoading(false)

    }
  };

  useEffect(() => {
    if (userId) {
      getSubscriptionStatus();
    } else {
      setLoading(false);
      // Prevent infinite loading if user isn't logged in
    }
  }, [userId, axiosPrivate]);

    // Calculate days remaining until renewal
    const calculateDaysRemaining = (renewalDate) => {
      const currentDate = new Date();
      const renewalDateObj = new Date(renewalDate);
      const timeDifference = renewalDateObj - currentDate;
      const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return daysRemaining;
    };

  if (loading) {
    return (
      <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>

        <LoadingSpinner />

      </div>
    )
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error}/>
  }

  if (isSubscribed === false) {
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  const daysRemaining = renewalDueDate ? calculateDaysRemaining(renewalDueDate) : null;

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>

      <div className="centered-container">
        <h3>Awesome! You're now a subscribed user!</h3>
        <h2>This page is private. Only subscribed users can access it.</h2>
        {daysRemaining !== null ? (
          <h4>Your subscription will remain active for {daysRemaining} more {daysRemaining === 1 ? 'day' : 'days'} unless revoked by an Administrator.</h4>
        ) : (
          <h4>Subscription renewal date is unavailable.</h4>
        )}

        <div className="interaction-box">
          <h3>Would you like to keep exploring the app?</h3>
          <ul>
            <li><strong>Sign In as an Administrator:</strong> Log in with the email "admin@socialtemplate.manucasanova.com" and password G7m!pLz@92aT.</li>
            <li><strong>Check out the admin features:</strong>
              <ul>
                <li>- Modify user roles in the 'Admin Users' section and use the filter to search by username or ID.</li>
                <li>- View the login history and audit logs to track changes to user roles.</li>
                <li>- Find your user and update its roles, such as becoming a moderator or an administrator.</li>
                <li>- As an administrator, attempt to revoke your own Admin role or modify another Admin's roles.</li>
                <li>- Create, edit, and delete roles. Then test access behavior with various role permissions.</li>

              </ul>
            </li>
          </ul>
        </div>

      </div>
    </div>

  );
}
