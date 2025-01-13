import { Link } from 'react-router-dom';
import '../../css/centeredContainer.css';

export default function User({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>

<div className="centered-container">
  <h3>Welcome! You're now a registered user!</h3>
  <h2>This page is private and accessible only to signed-in users.</h2>

  <div className="interaction-box">
    <h3>What's next?</h3>
    <ul>
      <li><strong>Update your profile:</strong> Click on the profile image to edit your picture, username, email, password, or even delete your account.</li>
      <li><strong>Subscribe:</strong> Head to the Subscriber section and click "Subscribe Now" to get full access (no credit card required—just hit the button).</li>
      <li><strong>Test real-life scenarios:</strong>
        <ul>
          <li>- Try deleting your account and signing up again with the same email.</li>
        </ul>
      </li>
    </ul>
  </div>
</div>

    </div>
  );
}
