import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function ProfileImage() {
  return (
    <div className='profile-image-container'>
      <FontAwesomeIcon className='profile-image' icon={faUser} size="2x"  /> 
    </div>
  );
}
