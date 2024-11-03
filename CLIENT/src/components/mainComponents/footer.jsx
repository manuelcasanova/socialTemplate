import React from 'react';

const Footer = ({ isNavOpen }) => {
  return (
    <footer className={`footer ${isNavOpen ? 'squeezed' : ''}`}>
      FOOTER
    </footer>
  );
};

export default Footer;
