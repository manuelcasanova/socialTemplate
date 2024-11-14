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
import Unauthorized from '../authComponents/Unauthorized';
import PersistLogin from '../authComponents/PersistLogin';

import RequireAuth from '../authComponents/RequireAuth';

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

        {/* Public routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={['Moderator', 'Admin', 'SuperAdmin']} />}>
          <Route path="/moderator" element={<Moderator />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['User_subscribed', 'Moderator', 'Admin', 'SuperAdmin']} />}>
          <Route path="/subscriber" element={<Subscriber />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={['User_not_subscribed', 'User_subscribed', 'Moderator', 'Admin', 'SuperAdmin']} />}>
          <Route path="/profile/myaccount" element={<Profile />} />
        </Route>

        {/* Admin-specific routes */}
        <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
        </Route>
      </Routes>
    </main>
  );
};

export default Body;
