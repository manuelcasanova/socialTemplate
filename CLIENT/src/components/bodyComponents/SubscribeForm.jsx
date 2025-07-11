import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

//Translation
import { useTranslation } from 'react-i18next';

import '../../css/SubscribeForm.css'

const SubscribeForm = ({ isNavOpen }) => {
    const { t } = useTranslation();
    const { auth, setAuth } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvc: ''
    });

    const [showPaymentForm, setShowPaymentForm] = useState(false); // State to toggle the display of the payment form
    const userId = auth.userId;

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    // Function to check the current subscription status
    const checkSubscriptionStatus = async () => {
        if (!userId) return;

        try {
            const response = await axiosPrivate.get(`/users/${userId}`);

            // Assuming response contains roles information
            const roles = response.data.roles;

            if (roles.includes('User_subscribed')) {
                setIsSubscribed(true);
            } else {
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Error fetching subscription status:', error);
            setErrorMessage('Unable to fetch subscription status.');
        }
    };

    // Function to reset the payment form and close it
    const handleClosePaymentForm = () => {
        setShowPaymentForm(false);
        setCardDetails({
            cardNumber: '',
            expMonth: '',
            expYear: '',
            cvc: ''
        });
    };

    // Simulated payment function
    const processPayment = async () => {
        if (!axiosPrivate) return;

        // Fake payment details (hardcoded for simulation purposes)
        const fakePaymentDetails = {
            amount: 1000, // $10.00 in cents
            currency: 'USD',
            cardNumber: '4242424242424242',
            expMonth: '12',
            expYear: '2025',
            cvc: '123',
        };

        setPaymentProcessing(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Call backend to process the payment
            const response = await axiosPrivate.post('/users/subscribe', {
                userId,
                paymentDetails: fakePaymentDetails,
            });

            if (response.status === 200) {

                // Update the roles to include "User_subscribed"
                const updatedAuth = {
                    ...auth,
                    roles: [...auth.roles, "User_subscribed"],
                };

                // Set the updated auth data
                setAuth(updatedAuth);

                setIsSubscribed(true);
                setSuccessMessage('Subscription successful!');
                setShowPaymentForm(false);
                navigate('/subscriber');
            } else {
                setErrorMessage(t('subscribeForm.paymentFailed'));
            }
        } catch (error) {
            console.error('Error processing payment:', error);

            const errorData = error?.response?.data?.error || 'An unexpected error occurred. Please try again.';

            setErrorMessage(t('subscribeForm.paymentFailedDetail', { error: errorData }));
        }
        finally {
            setPaymentProcessing(false);
        }
    };

    // UseEffect to check subscription status when component mounts
    useEffect(() => {
        if (axiosPrivate) {
            checkSubscriptionStatus();
        }
    }, [axiosPrivate, userId]);

    // Handle changes in the credit card details form
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;

        // Check if the field is expMonth
        if (name === "expMonth") {
            // Allow input for the first digit (0-9) and the second digit (0-9) only if valid
            if (/^\d{0,2}$/.test(value)) {
                // Allow the input to be 01-09 or 10-12
                if (parseInt(value, 10) <= 12 || value === "") {
                    setCardDetails(prevState => ({
                        ...prevState,
                        [name]: value
                    }));
                }
            }
        } else {
            // For other fields (like card number, expYear, CVC), update the state normally
            setCardDetails(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };







    return (
        <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
            <div className="subscription-container">
                <div className="subscription-cards">
                    {/* Left Card: Non-Subscribed Features */}
                    <div className="subscription-card not-subscribed">
                        <h3>{t('subscribeForm.standardPlanTitle')}</h3>
                        <ul>
                            <li>{t('subscribeForm.feature1')}</li>
                            <li>{t('subscribeForm.feature2')}</li>
                            <li>{t('subscribeForm.feature3')}</li>
                            <li>{t('subscribeForm.feature4')}</li>
                        </ul>
                    </div>

                    {/* Right Card: Subscribed Features / Subscribe Form */}
                    <div className="subscription-card not-subscribed">
                        <h3>{t('subscribeForm.premiumPlanTitle')}</h3>

                        <ul>
                            <li>{t('subscribeForm.feature1')}</li>
                            <li>{t('subscribeForm.feature2')}</li>
                            <li>{t('subscribeForm.feature3')}</li>
                            <li>{t('subscribeForm.feature4')}</li>
                            <li>{t('subscribeForm.premiumFeatureA')}</li>
                            <li>{t('subscribeForm.premiumFeatureB')}</li>
                        </ul>




                        {/* Show subscribe button if not subscribed */}
                        {!showPaymentForm && (
                            <button
                                onClick={() => setShowPaymentForm(true)}
                                className="subscribe-button"
                            >
                                {t('subscribeForm.subscribeNow')}
                            </button>
                        )}




                    </div>
                </div>

                {/* Show the payment form if the button is clicked */}
                {showPaymentForm && (
                    <div className="credit-card-form">
                        <h3>{t('subscribeForm.enterCardDetails')}</h3>

                        <button
                            className="close-button"
                            onClick={handleClosePaymentForm}
                            aria-label="Close"
                        >
                            ✖
                        </button>

                        <form>
                            <label>
                                {t('subscribeForm.cardNumber')}
                                <input
                                    type="number"
                                    name="cardNumber"
                                    value={cardDetails.cardNumber}
                                    onChange={handleCardInputChange}
                                    placeholder="4242 4242 4242 4242"
                                    maxLength="19"
                                    required
                                />
                            </label>
                            <label>
                                {t('subscribeForm.expMonth')}
                                <input
                                    type="number"
                                    name="expMonth"
                                    value={cardDetails.expMonth}
                                    onChange={handleCardInputChange}
                                    placeholder="MM"
                                    maxLength="2"
                                    required
                                />
                            </label>
                            <label>
                                {t('subscribeForm.expYear')}
                                <input
                                    type="text"
                                    name="expYear"
                                    value={cardDetails.expYear}
                                    onChange={handleCardInputChange}
                                    placeholder="YY"
                                    maxLength="4"
                                    required
                                />
                            </label>
                            <label>
                                {t('subscribeForm.cvc')}
                                <input
                                    type="text"
                                    name="cvc"
                                    value={cardDetails.cvc}
                                    onChange={handleCardInputChange}
                                    placeholder="123"
                                    maxLength="4"
                                    required
                                />
                            </label>
                        </form>

                        <button
                            onClick={processPayment}
                            disabled={paymentProcessing}
                            className="subscribe-button"
                        >
                            {paymentProcessing ? t('subscribeForm.processing') : t('subscribeForm.confirmPayment')}
                        </button>

                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscribeForm;
