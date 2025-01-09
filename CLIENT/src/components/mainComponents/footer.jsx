import React from 'react';

const Footer = ({ isNavOpen }) => {
  return (

    <footer className={`footer ${isNavOpen ? "footer-squeezed" : ""}`}>
      Footer
    </footer>
  );
};

export default Footer;
