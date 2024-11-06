import '../../css/Overlay.css'

import { useNavigate } from 'react-router-dom';

export default function Signup () {
  const navigate = useNavigate();

  const handleClose = () => {
      navigate('/'); 
  };

  return (
    <div className="overlay-component">
      <div className='centered-section'>
      <button className="close-button" onClick={handleClose}>
          ✖
        </button>
        Sign up
        </div>
    </div>
  )
}