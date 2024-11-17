import '../../css/ResetPassword.css';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import { useState, useEffect, useRef } from 'react';


export default function ResetPassword() {

  const [email, setEmail] = useState()
  const axiosPrivate = useAxiosPrivate()

  const emailRef = useRef();
  const errRef = useRef();
  const msgRef = useRef();

  const [errMsg, setErrMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrMsg('');
    setMsg('');
  }, [email])

  useEffect(() => {
    msgRef.current?.focus();
  }, [msg]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setMsg('');
    setLoading(true);

    try {
      const response = await axiosPrivate.post(`/forgot-password`,
        JSON.stringify({ email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (response.status === 200) {
        setMsg('An email with instructions to reset your password has been sent. Please check your inbox or spam folder.');
        msgRef.current?.focus();
      } else {
        setErrMsg('Unexpected response status: ' + response.status);
        errRef.current?.focus();
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
      errRef.current?.focus();
    } finally {
      setLoading(false); // Set loading to false once request completes
    }
  }


  return (
<section className="section-reset">
  <form onSubmit={handleSubmit} className="form-reset">
    <h3>Forgot password</h3>

    {msg ? (
      // Success State: Show title and success message only
      <p
        ref={msgRef}
        className="scsmsg"
        aria-live="assertive"
      >
        {msg}
      </p>
    ) : (
      // Default State: Show input, submit button, and sign-up link
      <>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        {loading ? (
          <div>
            <p style={{ marginBottom: '1em' }}>Please, wait. It may take up to a minute.</p>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div>
              <label>
                {/* Email address */}
              </label>
              <input
                type="email"
                placeholder="Enter email"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" className="button-reset">
                Submit
              </button>
            </div>
            <p className="p-reset">
              <a className="a-reset" href="/signup">
                Sign up
              </a>
            </p>
          </>
        )}
      </>
    )}
  </form>
</section>


  )
}