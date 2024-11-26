import '../../css/Overlay.css';
import '../../css/Signup.css';

import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from './../../api/axios.js';
import { Link } from "react-router-dom";

export default function Signup({isNavOpen, screenWidth}) {


  const navigate = useNavigate();

  const regexPatterns = {
    username: /^[A-z][A-z0-9-_]{3,23}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).{8,24}$/,
    email: /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  };

  const [formData, setFormData] = useState({
    user: '',
    email: '@example.com',
    pwd: 'Password1!',
    matchPwd: 'Password1!'
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


  const userRef = useRef();
  const errRef = useRef();

  useEffect(() => {
    if (!success && userRef.current) {
        userRef.current.focus();
    }
}, [success]);


  useEffect(() => {
    // Check validity after formData changes
    const newValidity = {
      name: regexPatterns.username.test(formData.user),
      email: regexPatterns.email.test(formData.email),
      pwd: regexPatterns.password.test(formData.pwd),
     // Validate match only if both pwd and matchPwd are non-empty
    match: formData.pwd && formData.matchPwd ? formData.pwd === formData.matchPwd : false
    };

    // If validity state is different, update it
    if (
      newValidity.name !== validity.name ||
      newValidity.email !== validity.email ||
      newValidity.pwd !== validity.pwd ||
      newValidity.match !== validity.match
    ) {
      setValidity(newValidity);
    }

    setErrMsg('');
  }, [formData]); // only depend on formData, not validity

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'email' ? value.toLowerCase() : value
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
      await axios.post(
        '/signup',
        JSON.stringify(formData),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setTimeout(() => {
      setSuccess(true);
      setFormData({ user: '', email: '', pwd: '', matchPwd: '' });
    }, 5000); 
    } catch (err) {
      const status = err?.response?.status;
      setErrMsg(
        status === 409 ? 'Username or Email Taken' :
          status ? 'Registration Failed' :
            'No Server Response'
      );
      errRef.current.focus();
    } finally {
      setTimeout(() => {
          setLoading(false); // Stop the spinner
          setIsSubmitting(false); // Re-enable the button
      }, 5000); // Ensure this matches the delay for success logic
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
      <p id={`${id}note`} className={focused[id] && !validity[validation] ? "instructions" : "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle} />{getValidationMessage(id)}
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
    <div className={`overlay-component ${isNavOpen && screenWidth < 1025 ? 'overlay-squeezed' : ''}`}>
      <button className="close-button" onClick={handleClose}>✖</button>
      {success ? (
        <section className='signup-success'>
          <div className="success-message">
            <h2>You're all set!</h2>
            <p>Congratulations, your account has been successfully created.</p>
            <p>Ready to get started? <Link to="/signin">Sign in</Link> to your new account.</p>
          </div>
        </section>
      ) : (
        <section className="centered-section">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
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
    

          <div className='have-an-account'>
            <p>Already have an account?</p>
            <p><Link to="/signin">Sign In</Link></p>
          </div>



        </section>
      )}
    </div>
  );
}
