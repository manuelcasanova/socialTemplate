import '../../css/Overlay.css';
import '../../css/Signup.css';

import { useNavigate, useLocation } from 'react-router-dom'; // Make sure to import useLocation
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from './../../api/axios.js';
import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth'; // Import the custom hook for authentication

import MockSignIn from './MockSignIn.js'; // Import the MockSignIn component

export default function SignIn() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth(); // Get handleLogin function from the custom hook
  const location = useLocation(); // Use useLocation to access location state

  const regexPatterns = {
    email: /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  };

  const [formData, setFormData] = useState({
    email: '',
    pwd: '',
    trustDevice: false
  });

  const [validity, setValidity] = useState({
    email: false,
    pwd: false
  });

  const [focused, setFocused] = useState({
    email: false,
    pwd: false
  });

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const emailRef = useRef();
  const errRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    // Check validity after formData changes
    const newValidity = {
      email: regexPatterns.email.test(formData.email),
      pwd: formData.pwd.length >= 8
    };

    if (
      newValidity.email !== validity.email ||
      newValidity.pwd !== validity.pwd
    ) {
      setValidity(newValidity);
    }

    setErrMsg('');
  }, [formData]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
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
    try {
      // Send login request to server
      const response = await axios.post(
        '/signin',
        JSON.stringify(formData),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      // Assuming the response contains the accessToken, roles, and user info
      const { accessToken, roles, userId, username } = response.data;

      // Call the handleLogin function from the useAuth hook to update the auth state
      handleLogin(accessToken, { userId, username, roles });

      // Successfully logged in
      setSuccess(true);
      setFormData({ email: '', pwd: '', trustDevice: false });

      // Get the "from" path from location state (if exists), or default to home
      const from = location.state?.from?.pathname || "/"; // Get the 'from' path if available in location state

      // Redirect to the previous page (or home if no previous page)
      navigate(from, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      setErrMsg(
        status === 401 ? 'Invalid Email or Password' :
          status ? 'Sign In Failed' :
            'No Server Response'
      );
      errRef.current.focus();
    }
  };

  const handleClose = () => navigate('/');

  const renderInput = (id, label, type, validation) => (
    <>
      <label htmlFor={id}>
        {label}:
        <FontAwesomeIcon icon={faCheck} className={validity[validation] ? "valid" : "hide"} />
        <FontAwesomeIcon icon={faTimes} className={!validity[validation] && formData[id] ? "invalid" : "hide"} />
      </label>
      <input
        type={type}
        id={id}
        ref={id === 'email' ? emailRef : null}
        autoComplete="off"
        value={formData[id]}
        onChange={handleInputChange}
        required
        aria-invalid={validity[validation] ? "false" : "true"}
        aria-describedby={`${id}note`}
        onFocus={() => handleFocusChange(id, true)}
        onBlur={() => handleFocusChange(id, false)}
      />
      <p id={`${id}note`} className={focused[id] && !validity[validation] ? "instructions" : "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle} />{getValidationMessage(id)}
      </p>
    </>
  );

  const getValidationMessage = (id) => {
    const messages = {
      email: "Must be a valid email address. Special characters allowed . - _",
      pwd: "Password must be at least 8 characters long."
    };
    return messages[id];
  };

  // Handle the form data received from the MockSignIn component
  const handleMockSignInData = (email, password) => {
    setFormData({
      email,
      pwd: password,
      trustDevice: formData.trustDevice // Retain trustDevice value if already checked
    });
  };

  return (
    <div className="overlay-component">

      <MockSignIn onUserSelect={handleMockSignInData} />   {/* Remove in production */}
    

      <button className="close-button" onClick={handleClose}>✖</button>
      {success ? (
        <section className='signup-success'>
          <div className="success-message">
            <h2>Welcome Back!</h2>
            <p>You have successfully signed in.</p>
            <p>Ready to get started? Go to <Link to="/home">Home</Link>.</p>
          </div>
        </section>
      ) : (
        <section className="centered-section">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <div className="signup-title">Sign In</div>
          <form className="signup-form" onSubmit={handleSubmit}>
            {renderInput("email", "Email", "text", "email")}
            {renderInput("pwd", "Password", "password", "pwd")}
            
            <div className="trust-device">
              <label htmlFor="trustDevice">
                <input 
                  type="checkbox" 
                  id="trustDevice" 
                  checked={formData.trustDevice}
                  onChange={handleInputChange} 
                />
                Trust This Device
              </label>
            </div>

            <button disabled={!Object.values(validity).every(Boolean)}>Sign In</button>
          </form>

          <p className="have-an-account">Need an account?<br /><span className="line"><Link to="/signup">Sign Up</Link></span></p>

          <p className="have-an-account">Forgot your password?<br /><span className="line"><Link to="/signup">Reset</Link></span></p>
        </section>
      )}
    </div>
  );
}
