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

  // ------- START POSTS SETTINGS ------- //

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
        setAllowFlagComments(settings.allow_flag_comments);
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
  const [allowFlagComments, setAllowFlagComments] = useState();

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
        setAllowFlagComments(false)

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
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagComments', { allow_flag_comments: false });
      } else {
        // If enabling: set all related settings to true
        setAllowAdminPost(true);
        setAllowUserPost(true);
        setAllowPostInteractions(true);
        setAllowComments(true);
        setAllowPostReactions(true);
        setAllowCommentReactions(true);
        setAllowDeletePosts(true);
        setAllowFlagPosts(true);
        setAllowDeleteComments(true);
        setAllowFlagComments(true);

        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminPost', { allow_admin_post: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowUserPost', { allow_user_post: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowPostInteractions', { allow_post_interactions: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowComments', { allow_comments: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowPostReactions', { allow_post_reactions: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeletePosts', { allow_delete_posts: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagPosts', { allow_flag_posts: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagComments', { allow_flag_comments: true });
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
        setAllowFlagComments(false);

        // Update the database with all related settings
        await axiosPrivate.put('/settings/global-provider/toggleAllowComments', { allow_comments: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowPostReactions', { allow_post_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeletePosts', { allow_delete_posts: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagPosts', { allow_flag_posts: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagComments', { allow_flag_comments: false });
      } else {
        setAllowComments(true);
        setAllowPostReactions(true);
        setAllowCommentReactions(true);
        setAllowDeletePosts(true);
        setAllowFlagPosts(true);
        setAllowDeleteComments(true);
        setAllowFlagComments(true);

        // Update the database with all related settings
        await axiosPrivate.put('/settings/global-provider/toggleAllowComments', { allow_comments: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowPostReactions', { allow_post_reactions: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeletePosts', { allow_delete_posts: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagPosts', { allow_flag_posts: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagComments', { allow_flag_comments: true });
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
        setAllowFlagComments(false);

        // Update the database with all related settings

        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagComments', { allow_flag_comments: false });
      } else {
        setAllowCommentReactions(true);
        setAllowDeleteComments(true);
        setAllowFlagComments(true);

        // Update the database with all related settings

        await axiosPrivate.put('/settings/global-provider/toggleAllowCommentReactions', { allow_comment_reactions: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteComments', { allow_delete_comments: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowFlagComments', { allow_flag_comments: true });
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

  const toggleAllowFlagComments = async () => {
    // Prevent changes if post interactions are disabled
    if (!allowPostInteractions) return;
    if (!allowComments) return;

    const newValue = !allowFlagComments;
    setAllowFlagComments(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowFlagComments', {
        allow_flag_comments: newValue
      });

    } catch (err) {
      console.error('Failed to update allowFlagComments setting:', err);
      setAllowFlagComments(prev => !prev);
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

  // ------- END POSTS SETTINGS ------- START MESSAGES SETTINGS //

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {
        setShowMessagesFeature(settings.show_messages_feature);
        setAllowSendMessages(settings.allow_send_messages);
        setAllowDeleteMessages(settings.allow_delete_messages);
      }
    };

    fetchSettings();
  }, [auth]);

  // Messages-related features
  const [showMessagesFeature, setShowMessagesFeature] = useState();
  const [allowSendMessages, setAllowSendMessages] = useState();
  const [allowDeleteMessages, setAllowDeleteMessages] = useState();

  const toggleShowMessagesFeature = async () => {
    // Prevent changes if post interactions are disabled
    const newValue = !showMessagesFeature;
    setShowMessagesFeature(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleShowMessagesFeature', {
        show_messages_feature: newValue
      });

      // If turning off, reset related settings
      if (!newValue) {

        setAllowSendMessages(false);
        setAllowDeleteMessages(false);

        // Update the database with all related settings

        await axiosPrivate.put('/settings/global-provider/toggleAllowSendMessages', { allow_send_messages: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteMessages', { allow_delete_messages: false });

      } else {
        setAllowSendMessages(true);
        setAllowDeleteMessages(true);

        // Update the database with all related settings

        await axiosPrivate.put('/settings/global-provider/toggleAllowSendMessages', { allow_send_messages: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteMessages', { allow_delete_messages: true });

      }
    } catch (err) {
      console.error('Failed to update showMessagesFeature setting:', err);
      setShowMessagesFeature(prev => !prev);
    }
  };


  const toggleAllowSendMessages = async () => {
    if (!showMessagesFeature) return;

    const newValue = !allowSendMessages;
    setAllowSendMessages(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowSendMessages', {
        allow_send_messages: newValue
      });

    } catch (err) {
      console.error('Failed to update allowSendMessages setting:', err);
      setAllowSendMessages(prev => !prev);
    }
  };

  const toggleAllowDeleteMessages = async () => {
    if (!showMessagesFeature) return;

    const newValue = !allowDeleteMessages;
    setAllowDeleteMessages(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteMessages', {
        allow_delete_messages: newValue
      });

    } catch (err) {
      console.error('Failed to update allowDeleteMessages setting:', err);
      setAllowDeleteMessages(prev => !prev);
    }
  };

  // ------- END MESSAGES SETTINGS ------- //

  // ------- START SOCIAL SETTINGS ------- //

  // Social-related features
const [showSocialFeature, setShowSocialFeature] = useState();
const [allowFollow, setAllowFollow] = useState();
const [allowMute, setAllowMute] = useState();

useEffect(() => {
  const fetchSettings = async () => {
    const settings = await getGlobalProviderSettings();

    if (settings) {

      setShowSocialFeature(settings.show_social_feature);
      setAllowFollow(settings.allow_follow);
      setAllowMute(settings.allow_mute);
    }
  };

  fetchSettings();
}, [auth]);


const toggleShowSocialFeature = async () => {
  const newValue = !showSocialFeature;
  setShowSocialFeature(newValue);
  try {
    await axiosPrivate.put('/settings/global-provider/toggleShowSocialFeature', {
      show_social_feature: newValue
    });

    // If turning off, reset related settings
    if (!newValue) {
      setAllowFollow(false);
      setAllowMute(false);

      await axiosPrivate.put('/settings/global-provider/toggleAllowFollow', { allow_follow: false });
      await axiosPrivate.put('/settings/global-provider/toggleAllowMute', { allow_mute: false });
    } else {
      setAllowFollow(true);
      setAllowMute(true);

      await axiosPrivate.put('/settings/global-provider/toggleAllowFollow', { allow_follow: true });
      await axiosPrivate.put('/settings/global-provider/toggleAllowMute', { allow_mute: true });
    }
  } catch (err) {
    console.error('Failed to update showSocialFeature setting:', err);
    setShowSocialFeature(prev => !prev);
  }
};

const toggleAllowFollow = async () => {
  if (!showSocialFeature) return;

  const newValue = !allowFollow;
  setAllowFollow(newValue);
  try {
    await axiosPrivate.put('/settings/global-provider/toggleAllowFollow', {
      allow_follow: newValue
    });
  } catch (err) {
    console.error('Failed to update allowFollow setting:', err);
    setAllowFollow(prev => !prev);
  }
};

const toggleAllowMute = async () => {
  if (!showSocialFeature) return;

  const newValue = !allowMute;
  setAllowMute(newValue);
  try {
    await axiosPrivate.put('/settings/global-provider/toggleAllowMute', {
      allow_mute: newValue
    });
  } catch (err) {
    console.error('Failed to update allowMute setting:', err);
    setAllowMute(prev => !prev);
  }
};

// ------- END SOCIAL SETTINGS ------- //

// ------- START ADMIN SETTINGS ------- //

const [allowManageRoles, setAllowManageRoles] = useState();
const [allowDeleteUsers, setAllowDeleteUsers] = useState();

useEffect(() => {
  const fetchSettings = async () => {
    const settings = await getGlobalProviderSettings();

    if (settings) {
      setAllowManageRoles(settings.allow_manage_roles);
      setAllowDeleteUsers(settings.allow_delete_users);
    }
  };

  fetchSettings();
}, [auth]);


const toggleAllowManageRoles = async () => {

  const newValue = !allowManageRoles;
  setAllowManageRoles(newValue);
  try {
    await axiosPrivate.put('/settings/global-provider/toggleAllowManageRoles', {
      allow_manage_roles: newValue
    });

  } catch (err) {
    console.error('Failed to update allowManageRoles setting:', err);
    setAllowManageRoles(prev => !prev);
  }
};

const toggleAllowDeleteUsers = async () => {

  const newValue = !allowDeleteUsers;
  setAllowDeleteUsers(newValue);
  try {
    await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteUsers', {
      allow_delete_users: newValue
    });

  } catch (err) {
    console.error('Failed to update allowDeleteUsers setting:', err);
    setAllowDeleteUsers(prev => !prev);
  }
};

// ------- END ADMIN SETTINGS ------- //

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
    allowFlagComments,
    
    showMessagesFeature,
    allowSendMessages,
    allowDeleteMessages,

    showSocialFeature,
    allowFollow,
    allowMute,

    allowManageRoles,
    allowDeleteUsers,

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
    setAllowFlagComments,
    
    setShowMessagesFeature,
    setAllowSendMessages,
    setAllowDeleteMessages,

    setShowSocialFeature,
    setAllowFollow,
    setAllowMute,

    setAllowManageRoles,
    setAllowDeleteUsers,

    toggleShowPostsFeature,
    toggleAllowUserPost,
    toggleAllowAdminPost,

    toggleAllowPostInteractions,
    toggleAllowComments,
    toggleAllowPostReactions,
    toggleAllowCommentReactions,
    toggleAllowDeletePosts,
    toggleAllowFlagPosts,
    toggleAllowDeleteComments,
    toggleAllowFlagComments,
    
    toggleShowMessagesFeature,
    toggleAllowSendMessages,
    toggleAllowDeleteMessages,
    
    toggleShowSocialFeature,
    toggleAllowFollow,
    toggleAllowMute,

    toggleAllowManageRoles,
    toggleAllowDeleteUsers
  };

  // console.log("postFeatures in Global Provider", postFeatures)
  // console.log("allowManageRoles", allowManageRoles)
  // console.log("allowDeleteUsers", allowDeleteUsers)

  return (
    <GlobalContext.Provider value={{
      postFeatures
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
