import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useState, useEffect, useRef } from 'react';

export default function ResetPassword() {

  const [email, setEmail] = useState()

const axiosPrivate = useAxiosPrivate()

const emailRef = useRef();
const errRef = useRef();
const msgRef = useRef();

const [errMsg, setErrMsg] = useState('');
const [msg, setMsg] = useState('');

useEffect(() => {
  setErrMsg('');
  setMsg('');
}, [email])

useEffect(()=> {
  msgRef.current.focus()
}, [msg])

useEffect(() => {
  emailRef.current.focus();
}, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = 
      await axiosPrivate.post(`/forgot-password`,
        JSON.stringify({ email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
          // console.log(response.statusText)

          setMsg('Email sent, check your inbox or spam')
          msgRef.current.focus();

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
           errRef.current.focus();
         }
    }


  return (
    <section>

    
      <form
        onSubmit={handleSubmit}
      >
        <h3
        className='text-align-center'
        >Forgot password</h3>

        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <p 
        ref={msgRef} 
        className={msg ? "scsmsg" : "offscreen"} 
        // className="errmsg" 
        aria-live="assertive">{msg}</p>

        <div className='text-align-center'>
          <label>
            {/* Email address */}
          </label>
          <input type='email'
            className='--background-grey --wider'
            placeholder="Enter email"
            ref={emailRef}
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="text-align-center">
          <button 
          type='submit' 
          className="button-black"
          >
            Submit
          </button>
        </div>
        <p className="text-align-center">
          <a href='/register'>Sign up</a>
        </p>

      </form>
      </section>
    )
  }