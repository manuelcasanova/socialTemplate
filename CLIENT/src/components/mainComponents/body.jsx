import React from 'react';
import { Routes, Route } from 'react-router-dom';


//Components
import Signin from '../authComponents/Signin'
import Home from '../bodyComponents/Home';
import About from '../bodyComponents/About';
import Moderator from '../bodyComponents/Moderator';
import Subscriber from '../bodyComponents/Subscriber';
import Admin from '../bodyComponents/Admin';

const Body = ({ isNavOpen }) => {
  return (
    <main className={`body ${isNavOpen ? 'squeezed' : ''}`}>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/moderator" element={<Moderator />} />
        <Route path="/subscriber" element={<Subscriber />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </main>
  );
};

export default Body;
