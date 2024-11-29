import './css/App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

//Components

import Navbar from './components/mainComponents/navBar';
import Body from './components/mainComponents/body';
import Footer from './components/mainComponents/footer';
import Hamburger from './components/mainComponents/hamburger';

function App() {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update screenWidth on window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const [isNavOpen, setIsNavOpen] = useState(false);


  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (

    <div className="app">

      <Navbar isNavOpen={isNavOpen} toggleNav={toggleNav}/>

      <button className={`hamburger ${isNavOpen ? 'hamburger-open' : ''}`} onClick={toggleNav}>
          &#9776; {/* Hamburger icon */}
        </button>

      <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
        <div className="body">
          <div>Body</div>
          <div>Body</div>
          <div>Body</div>
          <div>Body</div>
          <div>Body</div>
          <div>Body</div>
          <div>Body</div>
          <div>Body</div>
          <div>Body Last</div>
        </div>
        <div className="footer">Footer</div>
      </div>
      {/* <Hamburger isNavOpen={isNavOpen} toggleNav={toggleNav} />
        <Navbar isNavOpen={isNavOpen} toggleNav={toggleNav} />
        <Body isNavOpen={isNavOpen} screenWidth={screenWidth} />
        <Footer isNavOpen={isNavOpen} /> */}
    </div>

  );
}




export default App;
