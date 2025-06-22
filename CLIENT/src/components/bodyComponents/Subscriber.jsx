import Footer from "../mainComponents/footer";
import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import Error from "./Error";

//Translation
import { useTranslation } from 'react-i18next';

export default function Subscriber({ isNavOpen }) {
  const { t } = useTranslation();
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
        <h3>{t('subscriber.welcomeTitle')}</h3>
        <h2>{t('subscriber.privateNotice')}</h2>
        {daysRemaining !== null ? (
<h4>{t('subscriber.daysRemaining', { count: daysRemaining })}</h4>

        ) : (
          <h4>{t('subscriber.renewalUnavailable')}</h4>
        )}

        <div className="interaction-box">
          <h3>{t('subscriber.exploreTitle')}</h3>
          <ul>
            <li><strong>{t('subscriber.adminSignin')}</strong>{t('subscriber.adminSigninDesc')}</li>
            <li><strong>{t('subscriber.checkAdminFeatures')}</strong>
              <ul>
                <li>{t('subscriber.modifyRoles')}</li>
                <li>{t('subscriber.viewHistory')}</li>
                <li>{t('subscriber.updateRoles')}</li>
                <li>{t('subscriber.testRevokeSelf')}</li>
                <li>{t('subscriber.manageRoles')}</li>

              </ul>
            </li>
          </ul>
        </div>

      </div>
    </div>

  );
}
