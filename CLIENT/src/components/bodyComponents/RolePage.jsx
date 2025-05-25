export default function RolePage({ isNavOpen, role }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>Access restricted: Only users with the <em>{role.role_name}</em> role can view this page.</h2>


        <div className="interaction-box">
          <li>
            <ul>
              <li><strong>Explore admin scenarios:</strong></li>
              <li>- Modify a user's allowed roles.</li>
              <li>- From the Admin section, create, edit, and delete roles. Then test access behavior with various role permissions.</li>
              
            </ul>

          </li>


        </div>
      </div>
    </div>

  )
}






