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
        <Hamburger isNavOpen={isNavOpen} toggleNav={toggleNav} />
        <Navbar isNavOpen={isNavOpen} toggleNav={toggleNav} />
        <Body isNavOpen={isNavOpen} screenWidth={screenWidth} />
        <Footer isNavOpen={isNavOpen} />
      </div>

  );
}




export default App;
