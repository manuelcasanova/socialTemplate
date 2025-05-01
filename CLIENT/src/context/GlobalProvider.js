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
        setAllowDeletePosts(settings.allow_delete_posts);
        setAllowFlagPosts(settings.allow_flag_posts);
        setAllowDeleteComments(settings.allow_delete_comments);
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
  const [allowDeletePosts, setAllowDeletePosts] = useState();
  const [allowFlagPosts, setAllowFlagPosts] = useState();
  const [allowDeleteComments, setAllowDeleteComments] = useState();

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
        setAllowPostInteractions(false);
        setAllowComments(false);
        setAllowPostReactions(false);
        setAllowCommentReactions(false);
        setAllowDeletePosts(false);
        setAllowFlagPosts(false)
        setAllowDeleteComments(false)

        // Update the database with the new values for the other settings
        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminPost', { allow_admin_post: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowUserPost', { allow_user_post: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowPostInteractions', { allow_post_interactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowComments', { allow_comments: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowPostReactions', { allow_post_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeletePosts', { allow_delete_posts: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagPosts', { allow_flag_posts: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: false });
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
      // If turning off, reset related settings
      if (!newValue) {
        setAllowComments(false);
        setAllowPostReactions(false);
        setAllowCommentReactions(false);
        setAllowDeletePosts(false);
        setAllowFlagPosts(false);
        setAllowDeleteComments(false);

        // Update the database with all related settings
        await axiosPrivate.put('/settings/global-provider/toggleAllowComments', { allow_comments: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowPostReactions', { allow_post_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeletePosts', { allow_delete_posts: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagPosts', { allow_flag_posts: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: false });
      }
    } catch (err) {
      console.error('Failed to update allowPostInteractions setting:', err);
      setAllowPostInteractions(prev => !prev);
    }
  };

  const toggleAllowComments = async () => {
    // Prevent changes if post interactions are disabled
    if (!allowPostInteractions) return;
    const newValue = !allowComments;
    setAllowComments(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowComments', {
        allow_comments: newValue
      });

      // If turning off, reset related settings
      if (!newValue) {

        setAllowCommentReactions(false);
        setAllowDeleteComments(false);

        // Update the database with all related settings

        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: false });
      }


    } catch (err) {
      console.error('Failed to update allowComments setting:', err);
      setAllowComments(prev => !prev);
    }
  };

  const toggleAllowPostReactions = async () => {
    // Prevent changes if post interactions are disabled
    if (!allowPostInteractions) return;
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
    // Prevent changes if post interactions are disabled
    if (!allowPostInteractions) return;
    if (!allowComments) return;
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

  const toggleAllowDeletePosts = async () => {
    // Prevent changes if post interactions are disabled
    if (!allowPostInteractions) return;
    const newValue = !allowDeletePosts;
    setAllowDeletePosts(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowDeletePosts', {
        allow_delete_posts: newValue
      });
    } catch (err) {
      console.error('Failed to update allowDeletePosts setting:', err);
      setAllowDeletePosts(prev => !prev);
    }
  };

  const toggleAllowFlagPosts = async () => {
    // Prevent changes if post interactions are disabled
    if (!allowPostInteractions) return;
    const newValue = !allowFlagPosts;
    setAllowFlagPosts(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowFlagPosts', {
        allow_flag_posts: newValue
      });
    } catch (err) {
      console.error('Failed to update allowFlagPosts setting:', err);
      setAllowFlagPosts(prev => !prev);
    }
  };

  const toggleAllowDeleteComments = async () => {
    // Prevent changes if post interactions are disabled
    if (!allowPostInteractions) return;
    if (!allowComments) return;
  
    const newValue = !allowDeleteComments;
    setAllowDeleteComments(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', {
        allow_delete_comments: newValue
      });

    } catch (err) {
      console.error('Failed to update allowDeleteComments setting:', err);
      setAllowDeleteComments(prev => !prev);
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
    allowDeletePosts,
    allowFlagPosts,
    allowDeleteComments,
    

    setShowPostsFeature,
    setAllowUserPost,
    setAllowAdminPost,
    setAllowPostInteractions,
    setAllowComments,
    setAllowPostReactions,
    setAllowCommentReactions,
    setAllowDeletePosts,
    setAllowFlagPosts,
    setAllowDeleteComments,

    toggleShowPostsFeature,
    toggleAllowUserPost,
    toggleAllowAdminPost,
    toggleAllowPostInteractions,
    toggleAllowComments,
    toggleAllowPostReactions,
    toggleAllowCommentReactions,
    toggleAllowDeletePosts,
    toggleAllowFlagPosts,
    toggleAllowDeleteComments
  };

// console.log("postFeatures in Global Provider", postFeatures)
// console.log("allowDeletePosts", allowDeletePosts)

  return (
    <GlobalContext.Provider value={{
      postFeatures
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
