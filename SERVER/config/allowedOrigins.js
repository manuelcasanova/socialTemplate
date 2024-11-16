const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3500'
];

module.exports = allowedOrigins;

{/* <section className="forgot-password">
<form onSubmit={handleSubmit}>
    <h3>Forgot Password</h3>

    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <p ref={msgRef} className={msg ? "scsmsg" : "offscreen"} aria-live="assertive">{msg}</p>

    <div>
        <input 
            type="email" 
            placeholder="Enter email" 
            ref={emailRef} 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
        />
    </div>

    <div>
        <button type="submit" className="button-black">
            Submit
        </button>
    </div>

    <p>
        <a href="/signup">Sign up</a>
    </p>

    <button className="go-back" onClick={goBack}>Go Back</button>
</form>
</section> */}