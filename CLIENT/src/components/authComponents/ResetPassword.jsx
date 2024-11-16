import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import '../../css/ForgotPassword.css'

import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

export default function ResetPassword() {

  const [email, setEmail] = useState()
  const [errMsg, setErrMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axiosPrivate = useAxiosPrivate()

  const emailRef = useRef();
  const errRef = useRef();
  const msgRef = useRef();
  const navigate = useNavigate();



  useEffect(() => {
    setErrMsg('');
    setMsg('');
  }, [email])

  useEffect(() => {
    if (msg && msgRef.current) {
      msgRef.current.focus();
    }
  }, [msg]);
  
  useEffect(() => {
    if (errMsg && errRef.current) {
      errRef.current.focus();
    }
  }, [errMsg]);
  
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // setTimeout(async () => {
      try {
        await axiosPrivate.post(`/forgot-password`,
          JSON.stringify({ email }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        )
        // console.log(response.statusText)

        setMsg("An email containing password reset instructions has been sent. Please check your inbox or spam folder. It may take a few minutes.")
        if (msgRef.current) {
          msgRef.current.focus();
        }

      } catch (err) {
        console.log(err)
        // Always learned !err but not sure what's the sense behind. 
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 403) {
          setErrMsg('This email was not found in our database');
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
        } else {
          setErrMsg('Attempt Failed');
        }
        if (errRef.current) {
          errRef.current.focus();
        }
      } finally {
        setIsSubmitting(false); // End submitting, hide the spinner
      }

    // }, 5000);
  }


  const goBack = () => navigate(-1);

  return (
    <section className='forgot-password'>


      <form onSubmit={handleSubmit}>
        <h3>Forgot password</h3>

        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <p
          ref={msgRef}
          className={msg ? "scsmsg" : "offscreen"}
          // className="errmsg" 
          aria-live="assertive">{msg}</p>

        <div>
          <input type='email'
            placeholder="Enter email"
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          {isSubmitting ? (
            <LoadingSpinner />
          ) : (
            <button type='submit' className="button-reset-password">
              Submit
            </button>
          )}
        </div>

        <p>
          <a href='/signup'>Sign up</a>
        </p>

        <button className="go-back" onClick={goBack}>Go Back</button>

      </form>
    </section>
  )
}