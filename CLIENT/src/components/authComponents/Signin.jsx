import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//Hooks
import useAuth from '../../hooks/useAuth';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';

import axios from '../../api/axios';

//Components
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

//Styling
import '../../css/Signup.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

//Context
import { useGlobalAdminSettings } from '../../context/AdminSettingsProvider';

import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase'



const SIGNIN_URL = '/auth';
// const DEFAULT_EMAIL = '@example.com';
const DEFAULT_EMAIL = '';
// const DEFAULT_EMAIL = '';
const DEFAULT_PASSWORD = 'G7m!pLz@92aT';  // Hardcoded default password for development
// const DEFAULT_PASSWORD = '';


const Signin = ({ isNavOpen, screenWidth, setHasNewMessages, setHasCommentsReports, setHasPostReports }) => {

    const { t, i18n } = useTranslation();

    const { adminSettings } = useGlobalAdminSettings();

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
    const handleClose = () => {
        setShowSignUpWithEmail(prev => !prev)
        setErrMsg('')
    }

    // Password ref to access password value directly without state
    const passwordRef = useRef();

    useEffect(() => {
        if (passwordRef.current) {
            if (email.trim().toLowerCase() === 'administrator@socialtemplate.manucasanova.com') {
                passwordRef.current.value = DEFAULT_PASSWORD;
            } else {
                passwordRef.current.value = '';
            }
        }
    }, [email]);

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log("User signed in:", user);
                // Optionally auto-login user here
            }
        });

        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading(true);

        try {
            // Sign in using Google provider
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user) throw new Error("No user object returned from Firebase.");

            // Get user details
            const { email, displayName, uid } = user;

            // Now you can send the Firebase user data to your backend for further processing, like storing tokens
            const response = await axios.post('/auth/firebase-login', { email, displayName, uid }, { withCredentials: true });

            const { userId, roles, accessToken, preferredLanguage, hasNewMessages, hasPostReports, hasCommentsReports, socialVisibility, adminVisibility, loginHistoryVisibility } = response?.data;

            setHasNewMessages(hasNewMessages);
            setHasPostReports(hasPostReports);
            setHasCommentsReports(hasCommentsReports);

            // Set the user's preferred language
            i18n.changeLanguage(preferredLanguage);

            setAuth({ userId, displayName, email, roles, accessToken, socialVisibility, adminVisibility, loginHistoryVisibility });

            navigate(from, { replace: true });
        } catch (error) {
            console.error("Google Sign-In Error", error);

            const errorCode = error?.code;
            const status = error?.response?.status;
            const serverError = error?.response?.data?.error;
            const message = error?.message;

            if (errorCode === 'auth/popup-closed-by-user') {
                setErrMsg(t('signin.errors.popupClosed'));

            } else if (errorCode === 'auth/cancelled-popup-request') {
                setErrMsg(t('signin.errors.popupRequest'));
            } else if (errorCode === 'auth/popup-blocked') {
                setErrMsg(t('signin.errors.popupBlocked'));
            } else if (status === 404 && serverError === 'User not registered.') {
                setErrMsg(t('signin.errors.userNotRegistered'));
            } else if (!error.response) {
                setErrMsg(t('signin.errors.serverUnreachable'));
            } else {
                setErrMsg(serverError || message || t('signin.errors.serverUnreachable'));
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

    const mapErrorKey = (message) => {
        switch (message) {
            case "Please verify your email before logging in. Check your spam folder":
                return "verifyEmail";
            case "Login Failed":
                return "loginFailed";
            case "Wrong email or password":
                return "wrongEmailOrPassword";
            case "No Server Response":
                return "noServerResponse";
            default:
                return "loginFailed"; 
        }
    };

    const handleError = (err) => {

        const errorMessage = err?.response?.data?.error || t('signin.errors.loginFailed');

        if (err?.response?.data?.error) {
            setErrMsg(t(`signin.errors.${mapErrorKey(errorMessage)}`));

            if (errorMessage === "Please verify your email before logging in. Check your spam folder") {
                setIsVerified(false);
            }
        } else {
            setErrMsg(t('signin.errors.noServerResponse'));
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
            const { accessToken, userId, roles, preferredLanguage, hasNewMessages, hasPostReports, hasCommentsReports, socialVisibility, adminVisibility, loginHistoryVisibility } = response?.data || {};

            setHasNewMessages(hasNewMessages)
            setHasPostReports(hasPostReports);
            setHasCommentsReports(hasCommentsReports);
            setAuth({ userId, user, email, roles, accessToken, socialVisibility, adminVisibility, loginHistoryVisibility });
            // Set the user's preferred language
            i18n.changeLanguage(preferredLanguage);
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
                language: i18n.language
            }, {
                headers: {
                    'X-CSRF-Token': csrfToken,  // Include CSRF token in the request headers
                },
                withCredentials: true,
            });
            // You can show a success message here if needed
            setSuccessMsg(t('signin.verificationResent'));
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
                        <button className="close-button-2" onClick={handleClose}>✖</button>
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
                        {isLoading ? <LoadingSpinner /> : t('signin.resendVerification')}
                    </button>

                )}



                {/* <div className="signup-title">Sign In</div> */}

                {showSignUpWithEmail &&
                    <form className="signup-form" onSubmit={handleSubmit}>

                        {/* Remove on production */}

                        <div className="trust-device"
                        style={{marginTop: '1em'}}
                        >
                            <input
                                type="checkbox"
                                id="persist"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setEmail('administrator@socialtemplate.manucasanova.com');
                                    } else {
                                        setEmail('');
                                    }
                                }}
                            />
                            <label htmlFor="persist">{t('signin.loginAsAdmin')}</label>
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

                        <label htmlFor="password">{t('signin.password')}</label>
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
                            {isLoading ? <LoadingSpinner /> : t('signin.signInButton')}
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
                                    {t('signin.signInWithEmail')}
                                </button>


                                <button className="button-white" onClick={handleGoogleLogin} disabled={isLoading}>
                                    <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "10px" }} />
                                    {t('signin.signInWithGoogle')}
                                </button>

                            </>
                        }
                    </>
                }

                <div className="trust-device">
                    <input type="checkbox" id="persist" onChange={toggleCheck} checked={check} />
                    <label htmlFor="persist">{t('signin.trustDevice')}</label>
                </div>

                <div className="have-an-account">
                    <p>{t('signin.needAccount')}</p>
                    <Link to="/signup">{t('signin.signUp')}</Link>
                </div>

                <div className="have-an-account">
                    <p>{t('signin.forgotPassword')}</p>
                    <Link to="/resetpassword">{t('signin.reset')}</Link>
                </div>


            </div>
        </div >

    );
};

export default Signin;