const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3500'
];

module.exports = allowedOrigins;


// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from "react-router-dom";
// import useAxiosPrivate from '../../hooks/useAxiosPrivate';
// import '../../css/ForgotPassword.css'

// import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

// export default function ResetPassword() {
//   const [email, setEmail] = useState('');
//   const [errMsg, setErrMsg] = useState('');
//   const [msg, setMsg] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false); // Track submitting state
  
//   const axiosPrivate = useAxiosPrivate();
//   const emailRef = useRef();
//   const errRef = useRef();
//   const msgRef = useRef();
//   const navigate = useNavigate();

//   // Reset messages on email change
//   useEffect(() => {
//     setErrMsg('');
//     setMsg('');
//   }, [email]);

//   // Focus on message when it changes
//   useEffect(() => {
//     if (msgRef.current) {
//       msgRef.current.focus();
//     }
//   }, [msg]);

//   // Focus on email input on first render
//   useEffect(() => {
//     if (emailRef.current) {
//       emailRef.current.focus();
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrMsg('');
//     setMsg('');
//     setIsSubmitting(true); // Start submitting, show the spinner
    
//     // Simulate a 5-second delay (for testing purposes)
//     setTimeout(async () => {
//       try {
//         await axiosPrivate.post(`/forgot-password`, 
//           JSON.stringify({ email }), 
//           {
//             headers: { 'Content-Type': 'application/json' },
//             withCredentials: true
//           }
//         );

//         setMsg('A password reset email has been sent. Please check your inbox or spam folder. It may take a few minutes to arrive.');
//       } catch (err) {
//         console.log(err);
//         if (!err?.response) {
//           setErrMsg('No Server Response');
//         } else if (err.response?.status === 403) {
//           setErrMsg('This email was not found in our database');
//         } else if (err.response?.status === 401) {
//           setErrMsg('Unauthorized');
//         } else {
//           setErrMsg('Attempt Failed');
//         }
//       } finally {
//         setIsSubmitting(false); // End submitting, hide the spinner
//       }
//     }, 5000); // Simulate a 5-second delay for the API call
//   };

//   const goBack = () => navigate(-1);

//   return (
//     <section className='forgot-password'>
//       <form onSubmit={handleSubmit}>
//         <h3>Forgot password</h3>

//         {/* Error message */}
//         <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        
//         {/* Success message */}
//         <p 
//           ref={msgRef} 
//           className={msg ? "scsmsg" : "offscreen"} 
//           aria-live="assertive"
//         >
//           {msg}
//         </p>

//         <div>
//           <input 
//             type='email'
//             placeholder="Enter email"
//             ref={emailRef}
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             disabled={isSubmitting} // Disable input while submitting
//           />
//         </div>

//         <div>
//           {/* Conditionally render the submit button or loading spinner */}
//           {isSubmitting ? (
//             <LoadingSpinner />
//           ) : (
//             <button type='submit' className="button-reset-password">
//               Submit
//             </button>
//           )}
//         </div>

//         <p>
//           <a href='/signup'>Sign up</a>
//         </p>

//         <button className="go-back" onClick={goBack}>Go Back</button>
//       </form>
//     </section>
//   );
// }
