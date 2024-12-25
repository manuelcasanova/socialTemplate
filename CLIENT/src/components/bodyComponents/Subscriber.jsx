import Footer from "../mainComponents/footer";
import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function Subscriber({ isNavOpen }) {
  const { auth } = useAuth();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [isSubscribed, setIsSubscribed] = useState(null);

// console.log("isSubscribed", isSubscribed)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = auth?.userId;

  const getSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/users/subscriptions/status/${userId}`);
      // console.log("response data frontend", response.data)
      setIsSubscribed(response.data);
    } catch (error) {
      console.error("Error retrieving subscription status:", error);
      setError("Failed to retrieve subscription status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getSubscriptionStatus();
    } else {
      setLoading(false); // Prevent infinite loading if user isn't logged in
    }
  }, [userId, axiosPrivate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (isSubscribed === false) {
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return (
    <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
      <div className="body">
        <h2>All subscribed users have access to this page</h2>
      </div>
      <Footer />
    </div>
  );
}
