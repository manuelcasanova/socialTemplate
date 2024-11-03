import '../../css/Overlay.css'

import { useNavigate } from 'react-router-dom';

export default function Login () {
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
        Overlay section
        </div>
    </div>
  )
}