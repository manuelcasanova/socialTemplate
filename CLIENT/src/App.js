import './css/App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

//Hooks
import axios from './api/axios';

//Context
import { useGlobal } from '../src/context/GlobalProvider';

//Components

import Unauthorized from './components/authComponents/Unauthorized';
import PersistLogin from './components/authComponents/PersistLogin';
import RequireAuth from './components/authComponents/RequireAuth';

import Navbar from './components/mainComponents/navBar';
import Hamburger from './components/mainComponents/hamburger';

import Home from './components/bodyComponents/Home';
import User from './components/bodyComponents/User';
import Moderator from './components/bodyComponents/Moderator';
import Subscriber from './components/bodyComponents/Subscriber';
import Admin from './components/bodyComponents/Admin';

import Signin from './components/authComponents/Signin';
import Signup from './components/authComponents/Signup';
import ResetPassword from './components/authComponents/ResetPassword';

import Profile from './components/bodyComponents/Profile';
import AdminUsers from './components/bodyComponents/users/AdminUsers';

import RoleChangeLog from './components/bodyComponents/users/RoleChangeLog';
import SubscribeForm from './components/bodyComponents/SubscribeForm';
import LoginHistory from './components/bodyComponents/users/LoginHistory';
import NotFound from './components/bodyComponents/NotFound';
import Footer from './components/mainComponents/footer';

import SocialAllUsers from './components/bodyComponents/socialComponents/SocialAllUsers';
import SocialFollowers from './components/bodyComponents/socialComponents/SocialFollowers';
import SocialFollowee from './components/bodyComponents/socialComponents/SocialFollowee';
import SocialMuted from './components/bodyComponents/socialComponents/SocialMuted';
import SocialPendingRequests from './components/bodyComponents/socialComponents/SocialPendingRequests';
import SocialOneUser from './components/bodyComponents/socialComponents/SocialOneUser';

import UsersWithMessages from './components/bodyComponents/messagingComponents/UsersWithMessages'
import Chat from './components/bodyComponents/messagingComponents/Chat';

import Posts from './components/bodyComponents/postsComponents/Posts';
import PostComments from './components/bodyComponents/postsComponents/PostComments';
import PostReactions from './components/bodyComponents/postsComponents/PostReactions';
import PostCommentReactions from './components/bodyComponents/postsComponents/PostCommentReactions';

import ModeratorPosts from './components/bodyComponents/moderatorComponents/ModeratorPosts';
import ModeratorPostsHistory from './components/bodyComponents/moderatorComponents/ModeratorPostsHistory';
import HiddenPosts from './components/bodyComponents/moderatorComponents/HiddenPosts'

import ModeratorComments from './components/bodyComponents/moderatorComponents/ModeratorComments';
import HiddenComments from './components/bodyComponents/moderatorComponents/HiddenComments';
import ModeratorsCommentsHistory from './components/bodyComponents/moderatorComponents/ModeratorCommentsHistory';

import AdminSetup from './components/bodyComponents/adminComponents/AdminSetup';
import AdminRoles from './components/bodyComponents/rolesComponents/AdminRoles';
import RolePage from './components/bodyComponents/RolePage';


function App() {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isFollowNotification, setIsFollowNotification] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [customRoles, setCustomRoles] = useState([]);

  const [allRoles, setAllRoles] = useState([])

  const [loadingRoles, setLoadingRoles] = useState(false);
  console.log(loadingRoles)

  useEffect(() => {
    const fetchAllRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await axios.get('/all-roles-public');
        setAllRoles(response.data);
      } catch (err) {
        console.error('Failed to fetch all roles', err);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchAllRoles();
  }, []);

  // Update screenWidth on window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [profilePictureKey, setProfilePictureKey] = useState(0);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const fetchCustomRoles = async () => {
      try {
        const response = await axios.get('/custom-roles-public');
        setCustomRoles(response.data);
      } catch (err) {
        console.error('Failed to fetch custom roles', err);
      }
    };

    fetchCustomRoles();
  }, []);

  const { postFeatures } = useGlobal();

  return (

    <div className="app">

      <Navbar isNavOpen={isNavOpen} toggleNav={toggleNav} profilePictureKey={profilePictureKey} setProfilePictureKey={setProfilePictureKey} isFollowNotification={isFollowNotification} setIsFollowNotification={setIsFollowNotification} hasNewMessages={hasNewMessages} customRoles={customRoles} />

      <Hamburger isNavOpen={isNavOpen} toggleNav={toggleNav} />


      <Routes>

        {/* Public routes */}
        <Route path="/signin" element={<Signin isNavOpen={isNavOpen} screenWidth={screenWidth} setHasNewMessages={setHasNewMessages} />} />
        <Route path="/signup" element={<Signup isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
        <Route path="/" element={<Home isNavOpen={isNavOpen} />} />
        <Route path="resetpassword" element={<ResetPassword isNavOpen={isNavOpen} />} />


        <Route path="/unauthorized" element={<Unauthorized isNavOpen={isNavOpen} />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>

          {customRoles?.map(role => {
            const routePath = `/protected-routes/${role.role_name.toLowerCase()}`;
            const allowedRoles = ['SuperAdmin', 'Admin', 'Moderator'
              , role.role_name
            ];

            return (
              <Route key={role.role_name} element={<RequireAuth allowedRoles={['SuperAdmin', 'Admin', 'Moderator', `${role.role_name}`]} />}>
                <Route
                  path={routePath}
                  element={<RolePage role={role} isNavOpen={isNavOpen} />}
                />
              </Route>
            );
          })}

          <Route element={<RequireAuth allowedRoles={['User_not_subscribed', 'User_subscribed']} />}>
            <Route path="/user" element={<User isNavOpen={isNavOpen} />} />
          </Route>

          {
            postFeatures.showPostsFeature &&
            <>
              <Route element={<RequireAuth allowedRoles={['Moderator']} />}>
                <Route path="/moderator" element={<Moderator isNavOpen={isNavOpen} />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={['Moderator']} />}>
                <Route path="/moderator/posts" element={<ModeratorPosts isNavOpen={isNavOpen} />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={['Moderator']} />}>
                <Route path="/moderator/posts/history" element={<ModeratorPostsHistory isNavOpen={isNavOpen} />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={['Moderator']} />}>
                <Route path="/moderator/comments/history" element={<ModeratorsCommentsHistory isNavOpen={isNavOpen} />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={['Moderator']} />}>
                <Route path="/moderator/hidden/posts" element={<HiddenPosts isNavOpen={isNavOpen} />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={['Moderator']} />}>
                <Route path="/moderator/comments/" element={<ModeratorComments isNavOpen={isNavOpen} />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={['Moderator']} />}>
                <Route path="/moderator/hidden/comments/" element={<HiddenComments isNavOpen={isNavOpen} />} />
              </Route>
            </>
          }

          <Route element={<RequireAuth allowedRoles={['User_subscribed']} />}>
            <Route path="/subscriber" element={<Subscriber isNavOpen={isNavOpen} />} />
          </Route>
          <Route path="/subscribe" element={<SubscribeForm isNavOpen={isNavOpen} />} />
          <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
            <Route path="/admin" element={<Admin isNavOpen={isNavOpen} />} />
          </Route>

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="social/allusers" element={<SocialAllUsers isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
            </Route>
          )}

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="social/following" element={<SocialFollowee isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
            </Route>
          )}

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="social/followers" element={<SocialFollowers isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
            </Route>
          )}

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="social/muted" element={<SocialMuted isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
            </Route>
          )}

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="social/pending" element={<SocialPendingRequests isNavOpen={isNavOpen} screenWidth={screenWidth} isFollowNotification={isFollowNotification} setIsFollowNotification={setIsFollowNotification} />} />
            </Route>
          )}

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="social/users/:userId" element={<SocialOneUser isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
            </Route>
          )}

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="messages" element={<UsersWithMessages isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
            </Route>
          )}


          {postFeatures.showPostsFeature &&
            <>
              {!loadingRoles && (
                <Route element={<RequireAuth allowedRoles={allRoles} />}>
                  <Route path="posts/" element={<Posts isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
                </Route>
              )}

              {!loadingRoles && (
                <Route element={<RequireAuth allowedRoles={allRoles} />}>
                  <Route path="posts/:param" element={<PostComments isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
                </Route>
              )}


              {!loadingRoles && (
                <Route element={<RequireAuth allowedRoles={allRoles} />}>
                  <Route path="posts/reactions/:param" element={<PostReactions isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
                </Route>
              )}

              {!loadingRoles && (
                <Route element={<RequireAuth allowedRoles={allRoles} />}>
                  <Route path="posts/comments/reactions/:param" element={<PostCommentReactions isNavOpen={isNavOpen} screenWidth={screenWidth} />} />
                </Route>
              )}
            </>
          }

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route exact path="messages/:userId" element={<Chat isNavOpen={isNavOpen} setHasNewMessages={setHasNewMessages} />} />
            </Route>
          )}

          {!loadingRoles && (
            <Route element={<RequireAuth allowedRoles={allRoles} />}>
              <Route path="profile/myaccount" element={<Profile isNavOpen={isNavOpen} screenWidth={screenWidth} profilePictureKey={profilePictureKey} setProfilePictureKey={setProfilePictureKey} />} />
            </Route>
          )}

          {/* Admin-specific routes */}
          <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
            <Route path="/admin/users" element={<AdminUsers isNavOpen={isNavOpen} allowedRoles={['Admin', 'SuperAdmin']} customRoles={customRoles} setCustomRoles={setCustomRoles} />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
            <Route path="/admin/roles" element={<AdminRoles isNavOpen={isNavOpen} allowedRoles={['Admin', 'SuperAdmin']} customRoles={customRoles} setCustomRoles={setCustomRoles} />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['SuperAdmin']} />}>
            <Route path="/admin/superadmin/setup" element={<AdminSetup isNavOpen={isNavOpen} allowedRoles={['SuperAdmin']} />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
            <Route path="/admin/superadmin/rolechangelog" element={<RoleChangeLog isNavOpen={isNavOpen} allowedRoles={['SuperAdmin']} />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin', 'SuperAdmin']} />}>
            <Route path="/admin/superadmin/loginhistory" element={<LoginHistory isNavOpen={isNavOpen} allowedRoles={['SuperAdmin']} />} />
          </Route>

        </Route>
        <Route path="*" element={<NotFound isNavOpen={isNavOpen} />} />
      </Routes>
      <Footer isNavOpen={isNavOpen} />

    </div>

  );
}




export default App;
