export default function Error({ isNavOpen, error }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>Error</h2>

        <div className="error-header">What can you do?</div>
        <div className="error-suggestion">Reload the page.</div>
        <div className="error-suggestion">Close the browser. Sign in again.</div>
        <div className="error-suggestion">Come back later.</div>
        <div className="error-suggestion">If the issue persists, contact the web administrator and provide this error message: </div>
        <div className="error-message">
          <div className="error-message">
            {typeof error === 'string'
              ? error
              : error?.response?.data?.message || error?.message || 'An unknown error occurred'}
          </div>
        </div>
      </div>
    </div>


  )
}