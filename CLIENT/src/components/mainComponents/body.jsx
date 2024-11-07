import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';


//Components
import Signin from '../authComponents/Signin'
import Home from '../bodyComponents/Home';
import About from '../bodyComponents/About';
import Moderator from '../bodyComponents/Moderator';
import Subscriber from '../bodyComponents/Subscriber';
import Admin from '../bodyComponents/Admin';
import Signup from '../authComponents/Signup';
import Profile from '../bodyComponents/Profile';
import AdminUsers from '../bodyComponents/users/AdminUsers';



const Body = ({ isNavOpen }) => {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Update screenWidth on window resize
    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <main className={`body ${isNavOpen && screenWidth < 1025 ? 'squeezed' : ''}`}>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/moderator" element={<Moderator />} />
        <Route path="/subscriber" element={<Subscriber />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </main>
  );
};

export default Body;
