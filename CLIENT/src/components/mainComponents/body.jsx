import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';


//Components

import Home from '../bodyComponents/Home';
import User from '../bodyComponents/User';
import Moderator from '../bodyComponents/Moderator';
import Subscriber from '../bodyComponents/Subscriber';
import Admin from '../bodyComponents/Admin';
import Signup from '../authComponents/Signup';
import Profile from '../bodyComponents/Profile';
import AdminUsers from '../bodyComponents/users/AdminUsers';
import Unauthorized from '../authComponents/Unauthorized';
import Signin from '../authComponents/Signin'
import PersistLogin from '../authComponents/PersistLogin';
import RequireAuth from '../authComponents/RequireAuth';
import ResetPassword from '../authComponents/ResetPassword';


const Body = ({ isNavOpen, screenWidth }) => {


  return (
    <main className={`body ${isNavOpen && screenWidth < 1025 ? 'squeezed' : ''}`}>
      <Routes>

        {/* Public routes */}
        <Route path="/signin" element={<Signin isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
        <Route path="/signup" element={<Signup isNavOpen={isNavOpen} screenWidth={screenWidth}  />} />
        <Route path="/" element={<Home />} />
        <Route path="resetpassword" element={<ResetPassword/>}/>
        

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={['User_not_subscribed', 'User_subscribed', 'Moderator', 'Admin', 'SuperAdmin']} />}>
            <Route path="/user" element={<User />} />
          </Route>
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
            <Route path="/profile/myaccount" element={<Profile isNavOpen={isNavOpen} screenWidth={screenWidth}/>} />
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
