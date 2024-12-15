import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';
import axios from '../../api/axios';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import '../../css/Signup.css'

const SIGNIN_URL = '/auth';
const DEFAULT_EMAIL = '@example.com';
const DEFAULT_PASSWORD = 'Password1!';

const Signin = ({ isNavOpen, screenWidth }) => {

    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser] = useInput('user', '');
    const [pwd, setPwd] = useState(DEFAULT_PASSWORD);
    const [email, setEmail] = useState(DEFAULT_EMAIL);
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); 
    const [check, toggleCheck] = useToggle('persist', false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(true);

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const authenticateUser = async () => {
        return axios.post(SIGNIN_URL, JSON.stringify({ user, pwd, email: email.trim().toLowerCase() }), {
            headers: { 'Content-Type': 'application/json' },
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
        try {
            const response = await authenticateUser();
            const { accessToken, userId, roles } = response?.data || {};
            setAuth({ userId, user, email, roles, accessToken });
            resetUser();
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);  // Set loading state to false after submission is complete
        }
    };

    const handleClose = () => navigate('/');

    const handleResendVerification = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/auth/resend-verification-email', { 
                email: email.trim().toLowerCase(), 
            });
            // You can show a success message here if needed
            setSuccessMsg('Verification email resent successfully!');
            setErrMsg('');
        } catch (error) {
            // Handle error (e.g., invalid user, email mismatch, etc.)
            setErrMsg('Failed to resend verification email.');
            setSuccessMsg('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`body-overlay-component ${isNavOpen && screenWidth < 1025 ? 'overlay-squeezed' : ''}`}>
            <button className="close-button" onClick={handleClose}>✖</button>
            <section className="centered-section">
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

                
                <div className="signup-title">Sign In</div>


                <form className="signup-form" onSubmit={handleSubmit}>

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
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button className="button-auth" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner /> : 'Sign In'}
                    </button>
                    <div className="trust-device">
                        <input type="checkbox" id="persist" onChange={toggleCheck} checked={check} />
                        <label htmlFor="persist">Trust This Device</label>
                    </div>
                </form>

                <div className="have-an-account">
                    <p>Need an Account?</p>
                    <Link to="/signup">Sign Up</Link>
                </div>
                <div className="have-an-account">
                    <p>Forgot password?</p>
                    <Link to="/resetpassword">Reset</Link>
                </div>
            </section>
        </div>
    );
};

export default Signin;