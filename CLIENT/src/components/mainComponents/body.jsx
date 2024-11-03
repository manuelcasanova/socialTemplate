import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../authComponents/Login'

//Components
import Home from '../bodyComponents/Home';
import About from '../bodyComponents/About';

const Body = ({ isNavOpen }) => {
  return (
    <main className={`body ${isNavOpen ? 'squeezed' : ''}`}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </main>
  );
};

export default Body;
