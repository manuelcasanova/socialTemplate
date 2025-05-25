export default function Moderator({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>This page is private and accessible only to Moderators.</h2>

        <div className="interaction-box">
          <li><strong>Explore moderation scenarios:</strong>
            <ul>
              <li>- Report a post.</li>
              <li>- Mark the post as inappropriate and hide it from the Moderate Posts section.</li>
              <li>- Attempt to view the hidden post.</li>
              <li>- Restore the post from the Hidden Posts section.</li>
              <li>- Review the moderation history.</li>
              <li>- Repeat these actions for comments on posts.</li>
            </ul>
          </li>


        </div>
      </div>
    </div>

  )
}





