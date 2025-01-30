import Footer from "../mainComponents/footer"

export default function Moderator({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>This page is private and accessible only to Moderators.</h2>

        <div className="interaction-box">
          <p>The app is designed to include moderators, who could serve as an intermediary between regular users and administrators. For example, in a social section where users post comments, moderators could oversee conversations and remove any comments that violate the guidelines. While they don’t have full admin privileges, they would be able to intervene in a limited capacity to maintain order.</p>

        </div>
      </div>
    </div>

  )
}





