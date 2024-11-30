import './css/App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

//Components

import Navbar from './components/mainComponents/navBar';
import Hamburger from './components/mainComponents/hamburger';

import Home from './components/bodyComponents/Home';
import User from './components/bodyComponents/User';
import Moderator from './components/bodyComponents/Moderator';
import Subscriber from './components/bodyComponents/Subscriber';
import Admin from './components/bodyComponents/Admin';
import Signin from './components/authComponents/Signin';
import Signup from './components/authComponents/Signup';
import Profile from './components/bodyComponents/Profile';
import AdminUsers from './components/bodyComponents/users/AdminUsers';
import Unauthorized from './components/authComponents/Unauthorized';
import PersistLogin from './components/authComponents/PersistLogin';
import RequireAuth from './components/authComponents/RequireAuth';
import ResetPassword from './components/authComponents/ResetPassword';



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

      <Hamburger isNavOpen={isNavOpen} toggleNav={toggleNav} />


      <Routes>

{/* Public routes */}
<Route path="/signin" element={<Signin isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
<Route path="/signup" element={<Signup isNavOpen={isNavOpen} screenWidth={screenWidth}  />} />
<Route path="/" element={<Home isNavOpen={isNavOpen}/>} />
<Route path="resetpassword" element={<ResetPassword/>}/>


<Route path="/unauthorized" element={<Unauthorized />} />

{/* Protected Routes */}
<Route element={<PersistLogin />}>
<Route element={<RequireAuth allowedRoles={['User_not_subscribed', 'User_subscribed', 'Moderator', 'Admin', 'SuperAdmin']} />}>
    <Route path="/user" element={<User isNavOpen={isNavOpen}/>} />
  </Route>
  <Route element={<RequireAuth allowedRoles={['Moderator', 'Admin', 'SuperAdmin']} />}>
    <Route path="/moderator" element={<Moderator isNavOpen={isNavOpen} />} />
  </Route>
  <Route element={<RequireAuth allowedRoles={['User_subscribed', 'Moderator', 'Admin', 'SuperAdmin']} />}>
    <Route path="/subscriber" element={<Subscriber isNavOpen={isNavOpen} />} />
  </Route>
  <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
    <Route path="/admin" element={<Admin isNavOpen={isNavOpen} />} />
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


    </div>

  );
}




export default App;
