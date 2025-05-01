//axios
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

// context/GlobalProvider.js
import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

  const { auth } = useAuth();

  const getGlobalProviderSettings = async () => {
    try {
      const response = await axiosPrivate.get('/settings/global-provider');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch global provider settings:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {
        setShowPostsFeature(settings.show_posts_feature);
        setAllowUserPost(settings.allow_user_post);
        setAllowAdminPost(settings.allow_admin_post);
        setAllowPostInteractions(settings.allow_post_interactions);
        setAllowComments(settings.allow_comments);
        setAllowPostReactions(settings.allow_post_reactions);
        setAllowCommentReactions(settings.allow_comment_reactions);
      }
    };

    fetchSettings();
  }, [auth]);


  // Post-related features
  const [showPostsFeature, setShowPostsFeature] = useState(); // Superadmin decides whether Posts are enabled
  const [allowUserPost, setAllowUserPost] = useState(); // Registered users can post
  const [allowAdminPost, setAllowAdminPost] = useState(); // Admins can post
  const [allowPostInteractions, setAllowPostInteractions] = useState();
  const [allowComments, setAllowComments] = useState(); // Comments on posts
  const [allowPostReactions, setAllowPostReactions] = useState(); // Reactions to posts
  const [allowCommentReactions, setAllowCommentReactions] = useState(); // Reactions to comments

  // Toggle functions

  const toggleShowPostsFeature = async () => {
    const newValue = !showPostsFeature;
  
    try {
      // Update the database first
      await axiosPrivate.put('/settings/global-provider/toggleShowPostsFeature', {
        show_posts_feature: newValue
      });
  
      // If the posts feature is being disabled, reset the other two settings
      if (!newValue) {
        setAllowAdminPost(false);
        setAllowUserPost(false);
  
        // Update the database with the new values for the other settings
        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminPost', { allow_admin_post: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowUserPost', { allow_user_post: false });
      }
  
      // Then update the local state
      setShowPostsFeature(newValue);
  
    } catch (err) {
      console.error('Failed to update showPostsFeature setting:', err);
      setShowPostsFeature(prev => !prev); // Revert the state if the API request fails
    }
  };
  

  const toggleAllowUserPost = async () => {
    if (!showPostsFeature) return;
    const newValue = !allowUserPost;
    setAllowUserPost(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowUserPost', {
        allow_user_post: newValue
      });
    } catch (err) {
      console.error('Failed to update allowUserPost setting:', err);
      setAllowUserPost(prev => !prev);
    }
  };

  const toggleAllowAdminPost = async () => {
    if (!showPostsFeature) return;
    const newValue = !allowAdminPost;
    setAllowAdminPost(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowAdminPost', {
        allow_admin_post: newValue
      });
    } catch (err) {
      console.error('Failed to update allowAdminPost setting:', err);
      setAllowAdminPost(prev => !prev);
    }
  };

  const toggleAllowPostInteractions = async () => {
    if (!showPostsFeature) return;
    const newValue = !allowPostInteractions;
    setAllowPostInteractions(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowPostInteractions', {
        allow_post_interactions: newValue
      });
    } catch (err) {
      console.error('Failed to update allowPostInteractions setting:', err);
      setAllowPostInteractions(prev => !prev);
    }
  };

  const toggleAllowComments = async () => {
    const newValue = !allowComments;
    setAllowComments(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowComments', {
        allow_comments: newValue
      });
    } catch (err) {
      console.error('Failed to update allowComments setting:', err);
      setAllowComments(prev => !prev);
    }
  };

  const toggleAllowPostReactions = async () => {
    const newValue = !allowPostReactions;
    setAllowPostReactions(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowPostReactions', {
        allow_post_reactions: newValue
      });
    } catch (err) {
      console.error('Failed to update allowPostReactions setting:', err);
      setAllowPostReactions(prev => !prev);
    }
  };

  const toggleAllowCommentReactions = async () => {
    const newValue = !allowCommentReactions;
    setAllowCommentReactions(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', {
        allow_comment_reactions: newValue
      });
    } catch (err) {
      console.error('Failed to update allowCommentReactions setting:', err);
      setAllowCommentReactions(prev => !prev);
    }
  };


  const postFeatures = {
    showPostsFeature,
    allowUserPost,
    allowAdminPost,
    allowPostInteractions,
    allowComments,
    allowPostReactions,
    allowCommentReactions,

    setShowPostsFeature,
    setAllowUserPost,
    setAllowAdminPost,
    setAllowPostInteractions,
    setAllowComments,
    setAllowPostReactions,
    setAllowCommentReactions,

    toggleShowPostsFeature,
    toggleAllowUserPost,
    toggleAllowAdminPost,
    toggleAllowPostInteractions,
    toggleAllowComments,
    toggleAllowPostReactions,
    toggleAllowCommentReactions,
  };

  return (
    <GlobalContext.Provider value={{
      postFeatures
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
