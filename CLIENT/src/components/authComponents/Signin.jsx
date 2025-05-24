import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';
import axios from '../../api/axios';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import '../../css/Signup.css'

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";


const SIGNIN_URL = '/auth';
// const DEFAULT_EMAIL = '@example.com';
const DEFAULT_EMAIL = 'manucasanova@hotmail.com';
// const DEFAULT_EMAIL = '';
const DEFAULT_PASSWORD = 'G7m!pLz@92aT';  // Hardcoded default password for development
// const DEFAULT_PASSWORD = '';

const Signin = ({ isNavOpen, screenWidth, setHasNewMessages }) => {

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    const query = useQuery();
    const message = query.get('message'); // returns "Session expired. Please sign in again."


    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser] = useInput('user', '');
    const [email, setEmail] = useState(DEFAULT_EMAIL);
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(true);
    const [showSignUpWithEmail, setShowSignUpWithEmail] = useState(false);
    const handleShowSignUpWithEmail = () => setShowSignUpWithEmail(prev => !prev)

    // Password ref to access password value directly without state
    const passwordRef = useRef();

    useEffect(() => {
        if (
            process.env.NODE_ENV === 'development' &&
            showSignUpWithEmail &&
            passwordRef.current
        ) {
            passwordRef.current.value = DEFAULT_PASSWORD;
        }
    }, [showSignUpWithEmail]);

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, email]);

    // Function to get CSRF token from cookies
    const getCsrfToken = () => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrf_token='))
            ?.split('=')[1];
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading(true);

        try {
            // Sign in using Google provider
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get user details
            const { email, displayName, uid } = user;

            // Now you can send the Firebase user data to your backend for further processing, like storing tokens
            const response = await axios.post('/auth/firebase-login', { email, displayName, uid }, { withCredentials: true });

            const { userId, roles, accessToken, hasNewMessages } = response.data;

            setHasNewMessages(hasNewMessages);
            setAuth({ userId, displayName, email, roles, accessToken });

            navigate(from, { replace: true });
        } catch (error) {
            // console.error('Error during Google login:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrMsg(error.response.data.error);
            } else {
                setErrMsg('Failed to sign in with Google.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    const authenticateUser = async (password) => {
        const csrfToken = getCsrfToken();  // Get CSRF token from cookies
        return axios.post(SIGNIN_URL, JSON.stringify({ user, pwd: password, email: email.trim().toLowerCase() }), {
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            withCredentials: true,
        });
    };

    const handleError = (err) => {
        const errorMessage = err?.response?.data?.error || 'Login Failed';

        if (err?.response?.data?.error) {
            setErrMsg(errorMessage);

            // If the error message is related to email verification, set isVerified to false
            if (errorMessage === "Please verify your email before logging in. Check your spam folder") {
                setIsVerified(false);
            }
        } else {
            setErrMsg('No Server Response');
        }

        errRef.current.focus();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Get password value from ref, without storing it in state
        const password = passwordRef.current.value;

        try {
            const response = await authenticateUser(password);
            const { accessToken, userId, roles, hasNewMessages } = response?.data || {};
            setHasNewMessages(hasNewMessages)
            setAuth({ userId, user, email, roles, accessToken });
            resetUser();
            passwordRef.current.value = '';
            navigate(from, { replace: true });
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);  // Set loading state to false after submission is complete
        }
    };

    const handleResendVerification = async () => {
        setIsLoading(true);
        try {

            const csrfToken = getCsrfToken();
            await axios.post('/auth/resend-verification-email', {
                email: email.trim().toLowerCase(),
            }, {
                headers: {
                    'X-CSRF-Token': csrfToken,  // Include CSRF token in the request headers
                },
                withCredentials: true,
            });
            // You can show a success message here if needed
            setSuccessMsg('Verification email resent successfully!');
            setErrMsg('');
        } catch (error) {
            // Handle error (e.g., invalid user, email mismatch, etc.)
            setErrMsg('Failed to resend verification email. Try again in 15 minutes');
            setSuccessMsg('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`body ${isNavOpen && screenWidth < 1025 ? 'body-squeezed' : ''}`}>
            <div className='centered-section'>

                {message && <p style={{ color: 'red', marginBottom: '1em' }}>{message}</p>}

                {showSignUpWithEmail &&
                    <div className='close-button-container'>
                        <button className="close-button-2" onClick={handleShowSignUpWithEmail}>✖</button>
                    </div>
                }


                <p ref={errRef} className={successMsg ? "success-message-green" : "offscreen"} aria-live="assertive">
                    {successMsg}
                </p>
                {/* Display error message with existing styling */}
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
                {!isVerified && (

                    <button
                        className="button-auth button-resend-verification"
                        onClick={handleResendVerification}
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner /> : 'Resend Verification Email'}
                    </button>

                )}



                {/* <div className="signup-title">Sign In</div> */}

                {showSignUpWithEmail &&
                    <form className="signup-form" onSubmit={handleSubmit}>

                        {/* Remove on production */}

                        <div className="trust-device">
                            <input
                                type="checkbox"
                                id="persist"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setEmail('superadmin@example.com');
                                    } else {
                                        setEmail('manucasanova@hotmail.com');
                                    }
                                }}
                            />
                            <label htmlFor="persist">Login as superadmin</label>
                        </div>

                        {/* End remove on production */}

                        <label htmlFor="email">Email:</label>
                        <input
                            className="input-field"
                            type="text"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            className="input-field"
                            type="password"
                            id="password"
                            ref={passwordRef}
                            required
                        />

                        <button
                            className="button-auth"
                            disabled={isLoading}>
                            {isLoading ? <LoadingSpinner /> : 'Sign In'}
                        </button>

                    </form>
                }

                {!showSignUpWithEmail &&
                    <>

                        {isLoading ? <LoadingSpinner /> :
                            <>
                                <button
                                    className="button-white"
                                    style={{ marginBottom: '2em' }}
                                    onClick={handleShowSignUpWithEmail}
                                    disabled={isLoading}>
                                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "10px" }} />
                                    {'Sign In with Email'}
                                </button>


                                <button className="button-white" onClick={handleGoogleLogin} disabled={isLoading}>
                                    <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "10px" }} />
                                    Sign in with Google
                                </button>

                            </>
                        }
                    </>
                }

                <div className="trust-device">
                    <input type="checkbox" id="persist" onChange={toggleCheck} checked={check} />
                    <label htmlFor="persist">Trust This Device</label>
                </div>

                <div className="have-an-account">
                    <p>Need an Account?</p>
                    <Link to="/signup">Sign Up</Link>
                </div>
                <div className="have-an-account">
                    <p>Forgot password?</p>
                    <Link to="/resetpassword">Reset</Link>
                </div>

            </div>
        </div >

    );
};

export default Signin;