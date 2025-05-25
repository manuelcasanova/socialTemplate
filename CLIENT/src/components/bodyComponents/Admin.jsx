export default function Admin({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>This page is private and accessible only to Administrators.</h2>

        <div className="interaction-box">
          <li><strong>Explore admin scenarios:</strong>
            <ul>
              <li>- Modify a user's allowed roles.</li>
              <li>- Delete a user account.</li>
              <li>- View the Login History and audit logs for role changes.</li>
              <li>- Adjust settings and observe how features are enabled or disabled. Some features may be restricted by higher-tier administrators.</li>
            </ul>

          </li>


        </div>
      </div>
    </div>

  )
}





