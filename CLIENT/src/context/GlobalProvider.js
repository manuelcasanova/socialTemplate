//axios
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

// context/GlobalProvider.js
import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

  const {auth} = useAuth();

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
  const [allowComments, setAllowComments] = useState(); // Comments on posts
  const [allowPostReactions, setAllowPostReactions] = useState(); // Reactions to posts
  const [allowCommentReactions, setAllowCommentReactions] = useState(); // Reactions to comments

  // Toggle functions

  const toggleShowPostsFeature = async () => {
    const newValue = !showPostsFeature;
    setShowPostsFeature(newValue);
  
    try {
      await axiosPrivate.put('/settings/global-provider/toggleShowPostsFeature', {
        show_posts_feature: newValue
      });
    } catch (err) {
      console.error('Failed to update showPostsFeature setting:', err);
      // Revert on error
      setShowPostsFeature(prev => !prev);
    }
  };

  const toggleAllowUserPost = () => setAllowUserPost(prev => !prev);
  const toggleAllowAdminPost = () => setAllowAdminPost(prev => !prev);
  const toggleAllowComments = () => setAllowComments(prev => !prev);
  const toggleAllowPostReactions = () => setAllowPostReactions(prev => !prev);
  const toggleAllowCommentReactions = () => setAllowCommentReactions(prev => !prev);

  const postFeatures = {
    showPostsFeature,
    allowUserPost,
    allowAdminPost,
    allowComments,
    allowPostReactions,
    allowCommentReactions,

    setShowPostsFeature,
    setAllowUserPost,
    setAllowAdminPost,
    setAllowComments,
    setAllowPostReactions,
    setAllowCommentReactions,

    toggleShowPostsFeature,
    toggleAllowUserPost,
    toggleAllowAdminPost,
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
