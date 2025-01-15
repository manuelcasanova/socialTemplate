import React from 'react';

const Footer = ({ isNavOpen }) => {
  return (

    <footer className={`footer ${isNavOpen ? "footer-squeezed" : ""}`}>
      <div className='footer-container'>
        <div>Footer</div>
      </div>
    </footer>
  );
};

export default Footer;
