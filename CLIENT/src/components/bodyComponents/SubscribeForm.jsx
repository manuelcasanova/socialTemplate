import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

import '../../css/SubscribeForm.css'

const SubscribeForm = ({ isNavOpen }) => {
    const { auth } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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

        try {
            // Call backend to process the payment
            const response = await axiosPrivate.post('/users/subscribe', {
                userId,
                paymentDetails: fakePaymentDetails,
            });

            if (response.status === 200) {
                setIsSubscribed(true);
                alert('Subscription successful!');
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
                                <button
                                    onClick={processPayment}
                                    disabled={paymentProcessing}
                                    className="subscribe-button"
                                >
                                    {paymentProcessing ? 'Processing...' : 'Subscribe Now'}
                                </button>

                                {errorMessage && <div className="error-message">{errorMessage}</div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscribeForm;
