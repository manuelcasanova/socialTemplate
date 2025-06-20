import '../../css/ResetPassword.css';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';


export default function ResetPassword({isNavOpen}) {

  const { t } = useTranslation();

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
        setMsg(t('resetPassword.successMessage'));
        msgRef.current?.focus();
      } else {
        setErrMsg(t('resetPassword.unexpectedStatus', { status: response.status }));
        errRef.current?.focus();
      }
    } catch (err) {
      console.log(err)
      // Always learned !err but not sure what's the sense behind. 
      if (!err?.response) {
        setErrMsg(t('resetPassword.noServerResponse'));
      } else if (err.response?.status === 403) {
        setErrMsg('This email was not found in our database');
      } else if (err.response?.status === 401) {
        setErrMsg(t('resetPassword.unauthorized'));
      } else {
        setErrMsg(t('resetPassword.attemptFailed'));
      }
      errRef.current?.focus();
    } finally {
      setLoading(false); // Set loading to false once request completes
    }
  }


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
<section className="section-reset">
  <form onSubmit={handleSubmit} className="form-reset">
    <h3> {t('resetPassword.title')}</h3>

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
            <p style={{ marginBottom: '1em' }}> {t('resetPassword.loadingMessage')}</p>
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
                placeholder= {t('resetPassword.placeholderEmail')}
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>
            <div>
              <button type="submit" className="button-reset">
                 {t('resetPassword.submit')}
              </button>
            </div>
            <p className="p-reset">
              <a className="a-reset" href="/signup">
                {t('resetPassword.signUpLink')}
              </a>
            </p>
          </>
        )}
      </>
    )}
  </form>
</section>
</div>


  )
}