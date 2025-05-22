import '../../css/Signup.css';

import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle, faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import axios from './../../api/axios.js';
import { Link } from "react-router-dom";


import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



export default function Signup({ isNavOpen, screenWidth }) {

  const regexPatterns = {
    //username: /^[A-z][A-z0-9-_]{3,23}$/,
    username: /^[A-z][A-z0-9-_ ]{3,23}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).{8,24}$/,
    email: /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  };

  const [formData, setFormData] = useState({
    user: '',
    email: '',
    pwd: '',
    matchPwd: ''
  });

  const [validity, setValidity] = useState({
    name: false,
    email: false,
    pwd: false,
    match: false
  });

  const [focused, setFocused] = useState({
    user: false,
    email: false,
    pwd: false,
    matchPwd: false
  });

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restoreAction, setRestoreAction] = useState(false);
  const [showEmailSignUp, setShowEmailSignUp] = useState(false);

  const userRef = useRef();
  const errRef = useRef();

  const handleShowEmailSignup = () => { setShowEmailSignUp(prev => !prev) }

  useEffect(() => {
    if (!success && userRef.current) {
      userRef.current.focus();
    }
  }, [success]);

  useEffect(() => {
    const newValidity = {
      name: regexPatterns.username.test(formData.user),
      email: regexPatterns.email.test(formData.email),
      pwd: regexPatterns.password.test(formData.pwd),
      match: formData.pwd && formData.matchPwd ? formData.pwd === formData.matchPwd : false
    };

    if (
      newValidity.name !== validity.name ||
      newValidity.email !== validity.email ||
      newValidity.pwd !== validity.pwd ||
      newValidity.match !== validity.match
    ) {
      setValidity(newValidity);
    }

    setErrMsg('');
  }, [formData, regexPatterns.email, regexPatterns.password, regexPatterns.username, validity.name, validity.email, validity.pwd, validity.match]);


  const handleInputChange = (e) => {
    const { id, value } = e.target;

    const capitalizeFirstLetter = (str) => {
      return str
        .split(' ') // Split by spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
        .join(' '); // Join them back together
    };

    setFormData((prev) => ({
      ...prev,
      [id]: id === 'email' ? value.toLowerCase() : (id === 'user' ? capitalizeFirstLetter(value) : value)
    }));
  };

  const handleFocusChange = (id, status) => {
    setFocused((prev) => ({
      ...prev,
      [id]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(validity).every(Boolean)) {
      setErrMsg("Invalid Entry");
      return;
    }

    setIsSubmitting(true); // Disable the button
    setLoading(true); // Start the spinner

    try {
      const response = await axios.post(
        '/signup',
        JSON.stringify(formData),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      // Log the response to debug
      console.log('Backend Response:', response.data); // <-- Check if this is logged

      if (response.data.action === 'restore') {
        // Allow user to either restore or create a new account
        setErrMsg(response.data.message);
        setRestoreAction(true);
      } else if (response.data.success) {
        setSuccess(true);  // Handle success case if applicable
        setFormData({ user: '', email: '', pwd: '', matchPwd: '' });
      }

    } catch (err) {
      console.error('Error in request:', err);  // <-- Log any errors from the request

      if (err?.response) {
        const status = err.response.status;

        if (status === 400) {
          // Handle 400 error specifically (your custom response)
          console.log('Error Response Data:', err.response.data); // Log the custom error message and data

          if (err.response.data.action === 'restore') {
            // Allow user to either restore or proceed with new account creation
            setErrMsg(err.response.data.message);
            setRestoreAction(true); // Enable restore action
          } else {
            setErrMsg(err.response.data.message || 'An error occurred during signup.');
          }
        } else if (status === 409) {
          setErrMsg('Username or Email Taken');
        } else {
          setErrMsg('No Server Response');
        }
      } else {
        setErrMsg('No Server Response');
      }
      errRef.current.focus();
    } finally {
      setLoading(false); // Stop the spinner
      setIsSubmitting(false); // Re-enable the button
    }
  };


  const handleIgnoreRestoreAccount = () => {
    setRestoreAction(false)
    setFormData((prev) => ({
      ...prev,
      restoreAction
    }));

  }

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider(); // Google provider
      const result = await signInWithPopup(auth, provider); // Use the shared auth instance
      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await axios.post('/signup/google', { token: idToken });

      // console.log("response google status", response.status)

      if (response.status === 201) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Google Sign-Up Error:', err);

      if (err?.response?.status === 409) {
        setErrMsg('User with this email already exists.');
      } else {
        setErrMsg('Google Sign-Up failed. Please try again.');
      }

      errRef.current?.focus();

    }
  };



  const handleRestoreAccount = async () => {
    // Call an API to restore the account or reactivate the email
    setLoading(true);
    try {
      const response = await axios.post(
        '/restore-account', // Replace with your backend endpoint for account restoration
        { email: formData.email },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setErrMsg('Error restoring account.');
      errRef.current.focus();
    } finally {
      setLoading(false); // Stop the spinner after process is complete
    }
  };

  const renderInput = (id, label, type, validation) => (
    <>
      <label htmlFor={id}>
        {label}:
        <FontAwesomeIcon icon={faCheck} className={validity[validation] ? "valid" : "hide"} />
        <FontAwesomeIcon icon={faTimes} className={!validity[validation] && formData[id] ? "invalid" : "hide"} />
      </label>
      <input
        className='input-field'
        type={type}
        id={id}
        ref={id === 'user' ? userRef : null}
        autoComplete="off"
        value={formData[id]}
        onChange={handleInputChange}
        required
        aria-invalid={validity[validation] ? "false" : "true"}
        aria-describedby={`${id}note`}
        onFocus={() => handleFocusChange(id, true)}
        onBlur={() => handleFocusChange(id, false)}
      />
      <p
        id={`${id}note`}
        className={focused[id] && !validity[validation] && formData[id] !== "" ? "instructions" : "offscreen"}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
        {getValidationMessage(id)}
      </p>
    </>
  );

  const getValidationMessage = (id) => {
    const messages = {
      user: "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.",
      email: "Must be a valid email address. Special characters allowed . - _",
      pwd: "8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character. Allowed: !@#$%^&*.",
      matchPwd: "Must match the first password input field."
    };
    return messages[id];
  };

  return (
    <div className={`body ${isNavOpen && screenWidth < 1025 ? 'body-squeezed' : ''}`}>

      {/* Check if not showing email sign-up and success is true */}
      {!showEmailSignUp && success && (
        <section className='signup-success'>
          <div className="success-message">
            <h2>All Set!</h2>
            <p><Link to="/signin">Sign In</Link></p>
          </div>
        </section>
      )}

      {/* If not showing email sign-up and success is false */}
      {!showEmailSignUp && !success && (
        <div className='centered-section'>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <button className="button-white" style={{marginBottom: '2em'}} onClick={handleShowEmailSignup}>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "10px" }} />
            Sign up with Email
          </button>

          <button className="button-white" onClick={handleGoogleSignUp}>
            <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "10px" }} />
            Sign up with Google
          </button>

          <div className='have-an-account'>
            <p>Already have an account?</p>
            <p><Link to="/signin">Sign In</Link></p>
          </div>
        </div>
      )}

      {/* If showing email sign-up */}
      {showEmailSignUp && (
        <div className='centered-section transparent'>

          {success ? (
            <section className='signup-success'>
              <div className="success-message">
                <h2>All Set!</h2>
                <p>Please check your inbox (or spam folder) to verify your account.</p>
              </div>
            </section>
          ) : (
            <section className="centered-section">
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

              {/* Render the Restore Button if restoreAction is true */}
              {restoreAction && (
                <div className="restore-action">
                  <button
                    className="button-auth"
                    onClick={handleRestoreAccount}
                    disabled={isSubmitting || loading}
                  >
                    {loading ? (
                      <div className="spinner">
                        <div className="spinner__circle"></div>
                      </div>
                    ) : (
                      "Restore Account"
                    )}
                  </button>
                  <button
                    className="button-auth"
                    onClick={handleIgnoreRestoreAccount}
                  >Create a New Account</button>
                </div>
              )}
              <div className='close-button-container'>
                <button className="close-button-2" onClick={() => handleShowEmailSignup()}>✖</button>
              </div>
              <div className="signup-title">Sign Up</div>
              <form className="signup-form" onSubmit={handleSubmit}>
                {renderInput("user", "Name", "text", "name")}
                {renderInput("email", "Email", "text", "email")}
                {renderInput("pwd", "Password", "password", "pwd")}
                {renderInput("matchPwd", "Confirm Password", "password", "match")}

                <button className='button-auth' disabled={!Object.values(validity).every(Boolean) || isSubmitting}>
                  {loading ? (
                    <div className="spinner">
                      <div className="spinner__circle"></div>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              <button className="button-white" onClick={() => handleShowEmailSignup()}>
                <FontAwesomeIcon icon={faKey} style={{ marginRight: "10px" }} />
                Sign up through a partner
              </button>

              <div className='have-an-account'>
                <p>Already have an account?</p>
                <p><Link to="/signin">Sign In</Link></p>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}  