import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

import '../../css/SubscribeForm.css'

const SubscribeForm = ({ isNavOpen }) => {
    const { auth } = useAuth();
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
    const userId = auth.userId

    const axiosPrivate = useAxiosPrivate();

    // Function to check the current subscription status
    const checkSubscriptionStatus = async () => {
        if (!axiosPrivate) return;

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
                setIsSubscribed(true);
                setSuccessMessage('Subscription successful!');
            } else {
                setErrorMessage('Payment failed. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Payment failed. Please try again.');
            console.error('Error processing payment:', error);
        } finally {
            setPaymentProcessing(false);
        }
    };

    // UseEffect to check subscription status when component mounts
    useEffect(() => {
        if (axiosPrivate) {
            checkSubscriptionStatus();
        }
    }, [axiosPrivate, userId]);

    // UseEffect to show success message when the user subscribes
    useEffect(() => {
        if (isSubscribed) {
            setSuccessMessage('Subscription successful!');
        }
    }, [isSubscribed]);  // This will run when `isSubscribed` changes to true


    // Handle changes in the credit card details form
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
            <div className="body">
                <div className="subscription-container">
                    <h2>Subscription Status</h2>
                    <div className="subscription-status">
                        <div className={`status ${isSubscribed ? 'subscribed' : 'not-subscribed'}`}>
                            {isSubscribed ? 'You are subscribed!' : 'You are not subscribed.'}
                        </div>
                    </div>

                    <div className="payment-section">
                        {isSubscribed ? (
                            <p>Your subscription is active!</p>
                        ) : (
                            <div>

                                <div className="credit-card-form">
                                    <h3>Enter Credit Card Details</h3>
                                    <form>
                                        <label>
                                            Card Number
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={cardDetails.cardNumber}
                                                onChange={handleCardInputChange}
                                                placeholder="4242 4242 4242 4242"
                                                maxLength="16"
                                                required
                                            />
                                        </label>
                                        <label>
                                            Expiration Month
                                            <input
                                                type="text"
                                                name="expMonth"
                                                value={cardDetails.expMonth}
                                                onChange={handleCardInputChange}
                                                placeholder="MM"
                                                maxLength="2"
                                                required
                                            />
                                        </label>
                                        <label>
                                            Expiration Year
                                            <input
                                                type="text"
                                                name="expYear"
                                                value={cardDetails.expYear}
                                                onChange={handleCardInputChange}
                                                placeholder="YYYY"
                                                maxLength="4"
                                                required
                                            />
                                        </label>
                                        <label>
                                            CVC
                                            <input
                                                type="text"
                                                name="cvc"
                                                value={cardDetails.cvc}
                                                onChange={handleCardInputChange}
                                                placeholder="123"
                                                maxLength="3"
                                                required
                                            />
                                        </label>
                                    </form>
                                </div>

                                <button
                                    onClick={processPayment}
                                    disabled={paymentProcessing}
                                    className="subscribe-button"
                                >
                                    {paymentProcessing ? 'Processing...' : 'Subscribe Now'}
                                </button>

                                {errorMessage && <div className="error-message">{errorMessage}</div>}
                                {successMessage && <div className="success-message">{successMessage}</div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscribeForm;
