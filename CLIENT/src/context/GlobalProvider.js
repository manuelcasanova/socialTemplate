//axios
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

// context/GlobalProvider.js
import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

  const { auth } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getGlobalProviderSettings = async () => {
    try {
      const response = await axiosPrivate.get('/settings/global-provider');
      return response.data;
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        return null;
      } else {
        console.error('Failed to fetch global provider settings:', err);
        return null;
      }
    }
  };

  // ------- START POSTS SETTINGS ------- //

  useEffect(() => {
    if (!auth?.accessToken) return;
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await getGlobalProviderSettings();

        if (settings) {
          setShowPostsFeature(settings?.show_posts_feature ?? false);
          setAllowUserPost(settings?.allow_user_post ?? false);
          setAllowAdminPost(settings?.allow_admin_post ?? false);
          setAllowPostInteractions(settings?.allow_post_interactions ?? false);
          setAllowComments(settings?.allow_comments ?? false);
          setAllowPostReactions(settings?.allow_post_reactions ?? false);
          setAllowCommentReactions(settings?.allow_comment_reactions ?? false);
          setAllowDeletePosts(settings?.allow_delete_posts ?? false);
          setAllowFlagPosts(settings?.allow_flag_posts ?? false);
          setAllowDeleteComments(settings?.allow_delete_comments ?? false);
          setAllowFlagComments(settings?.allow_flag_comments ?? false);
        }
      } catch (err) {
        setError(err); // set error to be consumed by components
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [auth?.accessToken]);

  // Post-related features
  const [showPostsFeature, setShowPostsFeature] = useState(false); // Superadmin decides whether Posts are enabled
  const [allowUserPost, setAllowUserPost] = useState(false); // Registered users can post
  const [allowAdminPost, setAllowAdminPost] = useState(false); // Admins can post
  const [allowPostInteractions, setAllowPostInteractions] = useState(false);
  const [allowComments, setAllowComments] = useState(false); // Comments on posts
  const [allowPostReactions, setAllowPostReactions] = useState(false); // Reactions to posts
  const [allowCommentReactions, setAllowCommentReactions] = useState(false); // Reactions to comments
  const [allowDeletePosts, setAllowDeletePosts] = useState(false);
  const [allowFlagPosts, setAllowFlagPosts] = useState(false);
  const [allowDeleteComments, setAllowDeleteComments] = useState(false);
  const [allowFlagComments, setAllowFlagComments] = useState(false);

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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
    }
  };

  // ------- END POSTS SETTINGS ------- START MESSAGES SETTINGS //

  useEffect(() => {
    if (!auth?.accessToken) return;
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {
        setShowMessagesFeature(settings?.show_messages_feature ?? false);
        setAllowSendMessages(settings?.allow_send_messages ?? false);
        setAllowDeleteMessages(settings?.allow_delete_messages ?? false);
      }
    };

    fetchSettings();
  }, [auth?.accessToken]);

  // Messages-related features
  const [showMessagesFeature, setShowMessagesFeature] = useState(false);
  const [allowSendMessages, setAllowSendMessages] = useState(false);
  const [allowDeleteMessages, setAllowDeleteMessages] = useState(false);

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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
    }
  };

  // ------- END MESSAGES SETTINGS ------- //

  // ------- START SOCIAL SETTINGS ------- //

  // Social-related features
  const [showSocialFeature, setShowSocialFeature] = useState(false);
  const [allowFollow, setAllowFollow] = useState(false);
  const [allowMute, setAllowMute] = useState(false);

  useEffect(() => {
    if (!auth?.accessToken) return;
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {

        setShowSocialFeature(settings?.show_social_feature ?? false);
        setAllowFollow(settings?.allow_follow ?? false);
        setAllowMute(settings?.allow_mute ?? false);
      }
    };

    fetchSettings();
  }, [auth?.accessToken]);


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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
    }
  };

  // ------- END SOCIAL SETTINGS ------- //

  // ------- START ADMIN SETTINGS ------- //

  const [allowManageRoles, setAllowManageRoles] = useState(false);
  const [allowDeleteUsers, setAllowDeleteUsers] = useState(false);

  useEffect(() => {
    if (!auth?.accessToken) return;
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {
        setAllowManageRoles(settings?.allow_manage_roles ?? false);
        setAllowDeleteUsers(settings?.allow_delete_users ?? false);
      }
    };

    fetchSettings();
  }, [auth?.accessToken]);


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
      setError(err.message)
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
      setError(err.message)
    }
  };

  // ------- END ADMIN SETTINGS ------- //


  // ------- START PROFILE SETTINGS ------- //

  const [showProfileFeature, setShowProfileFeature] = useState(false);
  const [allowEditUsername, setAllowEditUsername] = useState(false);
  const [allowEditEmail, setAllowEditEmail] = useState(false);
  const [allowEditPassword, setAllowEditPassword] = useState(false);
  const [allowDeleteMyUser, setAllowDeleteMyUser] = useState(false);
  const [allowModifyProfilePicture, setAllowModifyProfilePicture] = useState(false);

  useEffect(() => {
    if (!auth?.accessToken) return;
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {
        setShowProfileFeature(settings?.show_profile_feature ?? false);
        setAllowEditUsername(settings?.allow_edit_username ?? false);
        setAllowEditEmail(settings?.allow_edit_email ?? false);
        setAllowEditPassword(settings?.allow_edit_password ?? false);
        setAllowModifyProfilePicture(settings?.allow_modify_profile_picture ?? false);
        setAllowDeleteMyUser(settings?.allow_delete_my_user ?? false)
      }
    };
    fetchSettings();
  }, [auth?.accessToken]);

  const toggleShowProfileFeature = async () => {
    const newValue = !showProfileFeature;

    try {
      // Update the database first
      await axiosPrivate.put('/settings/global-provider/toggleShowProfileFeature', {
        show_profile_feature: newValue
      });

      // If the profile feature is being disabled, reset the other two settings
      if (!newValue) {
        setAllowEditUsername(false);
        setAllowEditEmail(false);
        setAllowEditPassword(false);
        setAllowModifyProfilePicture(false);
        setAllowDeleteMyUser(false);


        // Update the database with the new values for the other settings
        await axiosPrivate.put('/settings/global-provider/toggleAllowEditUsername', { allow_edit_username: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowEditEmail', { allow_edit_email: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowEditPassword', { allow_edit_password: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowModifyProfilePicture', { allow_modify_profile_picture: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteMyUser', { allow_delete_my_user: false });


      } else {
        // If enabling: set all related settings to true
        setAllowEditUsername(true);
        setAllowEditEmail(false);
        setAllowEditPassword(true);
        setAllowModifyProfilePicture(true);
        setAllowDeleteMyUser(true);


        await axiosPrivate.put('/settings/global-provider/toggleAllowEditUsername', { allow_edit_username: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowEditEmail', { allow_edit_email: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowEditPassword', { allow_edit_password: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowModifyProfilePicture', { allow_modify_profile_picture: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteMyUser', { allow_delete_my_user: true });
      }

      // Then update the local state
      setShowProfileFeature(newValue);

    } catch (err) {
      console.error('Failed to update showProfileFeature setting:', err);
      setShowProfileFeature(prev => !prev); // Revert the state if the API request fails
      setError(err.message)
    }
  };


  const toggleAllowEditUsername = async () => {

    const newValue = !allowEditUsername;
    setAllowEditUsername(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowEditUsername', {
        allow_edit_username: newValue
      });

    } catch (err) {
      console.error('Failed to update allowEditUsername setting:', err);
      setAllowEditUsername(prev => !prev);
      setError(err.message)
    }
  };

  const toggleAllowEditEmail = async () => {

    const newValue = !allowEditEmail;
    setAllowEditEmail(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowEditEmail', {
        allow_edit_email: newValue
      });

    } catch (err) {
      console.error('Failed to update allowEditEmail setting:', err);
      setAllowEditEmail(prev => !prev);
      setError(err.message)
    }
  };

  const toggleAllowEditPassword = async () => {

    const newValue = !allowEditPassword;
    setAllowEditPassword(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowEditPassword', {
        allow_edit_password: newValue
      });

    } catch (err) {
      console.error('Failed to update allowEditPassword setting:', err);
      setAllowEditPassword(prev => !prev);
      setError(err.message)
    }
  };

  const toggleAllowEditProfileImage = async () => {

    const newValue = !allowModifyProfilePicture;
    setAllowModifyProfilePicture(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowModifyProfilePicture', {
        allow_modify_profile_picture: newValue
      });

    } catch (err) {
      console.error('Failed to update allowModifyProfilePicture setting:', err);
      setAllowModifyProfilePicture(prev => !prev);
      setError(err.message)
    }
  };

  const toggleAllowDeleteMyUser = async () => {

    const newValue = !allowDeleteMyUser;
    setAllowDeleteMyUser(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowDeleteMyUser', {
        allow_delete_my_user: newValue
      });

    } catch (err) {
      console.error('Failed to update allowDeleteMyUser setting:', err);
      setAllowDeleteMyUser(prev => !prev);
      setError(err.message)
    }
  };


  // ------- END PROFILE SETTINGS ------- //


  // ------- START SUBSCRIBER SETTINGS ------- //


  const [showSubscriberFeature, setShowSubscriberFeature] = useState(false);


  useEffect(() => {
    if (!auth?.accessToken) return;
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {
        setShowSubscriberFeature(settings?.show_subscriber_feature ?? false);
      }
    };
    fetchSettings();
  }, [auth?.accessToken]);


  const toggleShowSubscriberFeature = async () => {

    const newValue = !showSubscriberFeature;
    setShowSubscriberFeature(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleShowSubscriberFeature', {
        show_subscriber_feature: newValue
      });

    } catch (err) {
      console.error('Failed to update showSubscriberFeature setting:', err);
      setShowSubscriberFeature(prev => !prev);
      setError(err.message)
    }
  };

  // ------- END SUBSCRIBER SETTINGS ------- //


  // ------- START CUSTOM ROLES SETTINGS ------- //


  const [showCustomRolesFeature, setShowCustomRolesFeature] = useState(false);
  const [allowAdminCreateCustomRole, setAllowAdminCreateCustomRole] = useState(false)
  const [allowAdminEditCustomRole, setAllowAdminEditCustomRole] = useState(false)
  const [allowAdminDeleteCustomRole, setAllowAdminDeleteCustomRole] = useState(false)



  useEffect(() => {
    if (!auth?.accessToken) return;
    const fetchSettings = async () => {
      const settings = await getGlobalProviderSettings();

      if (settings) {
        setShowCustomRolesFeature(settings?.show_manage_roles_feature ?? false);
      }
    };
    fetchSettings();
  }, [auth?.accessToken]);


  const toggleShowCustomRolesFeature = async () => {

    const newValue = !showCustomRolesFeature;
    setShowCustomRolesFeature(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleShowCustomRolesFeature', {
        show_manage_roles_feature: newValue
      });

      // If turning off, reset related settings
      if (!newValue) {

        setAllowAdminCreateCustomRole(false);
        setAllowAdminEditCustomRole(false);
        setAllowAdminDeleteCustomRole(false);

        // Update the database with all related settings

        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminCreateCustomRole', { allow_admin_create_custom_role: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminEditCustomROle', { allow_admin_edit_custom_role: false });
        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminDeleteCustomROle', { allow_admin_delete_custom_role: false });

      } else {
        setAllowAdminCreateCustomRole(true);
        setAllowAdminEditCustomRole(true);
        setAllowAdminDeleteCustomRole(true);

        // Update the database with all related settings

        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminCreateCustomRole', { allow_admin_create_custom_role: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminEditCustomRole', { allow_admin_edit_custom_role: true });
        await axiosPrivate.put('/settings/global-provider/toggleAllowAdminDeleteCustomRole', { allow_admin_delete_custom_role: true });
      }

    } catch (err) {
      console.error('Failed to update showCustomRolesFeature setting:', err);
      setShowSubscriberFeature(prev => !prev);
      setError(err.message)
    }
  };

  const toggleAllowAdminCreateCustomRole = async () => {
    if (!showCustomRolesFeature) return;

    const newValue = !allowAdminCreateCustomRole;
    setAllowAdminCreateCustomRole(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowAdminCreateCustomRole', {
        allow_admin_create_custom_role: newValue
      });

    } catch (err) {
      console.error('Failed to update allowAdminCreateCustomRole setting:', err);
      setAllowSendMessages(prev => !prev);
      setError(err.message)
    }
  };

  const toggleAllowAdminEditCustomRole = async () => {
    if (!showCustomRolesFeature) return;

    const newValue = !allowAdminEditCustomRole;
    setAllowAdminEditCustomRole(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowAdminEditCustomRole', {
        allow_admin_edit_custom_role: newValue
      });

    } catch (err) {
      console.error('Failed to update allowAdminEditCustomRole setting:', err);
      setAllowSendMessages(prev => !prev);
      setError(err.message)
    }
  };

  const toggleAllowAdminDeleteCustomRole = async () => {
    if (!showCustomRolesFeature) return;

    const newValue = !allowAdminDeleteCustomRole;
    setAllowAdminDeleteCustomRole(newValue);
    try {
      await axiosPrivate.put('/settings/global-provider/toggleAllowAdminDeleteCustomRole', {
        allow_admin_delete_custom_role: newValue
      });

    } catch (err) {
      console.error('Failed to update allowAdminDeleteCustomRole setting:', err);
      setAllowSendMessages(prev => !prev);
      setError(err.message)
    }
  };



  // ------- END CUSTOM ROLES SETTINGS ------- //



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

    showProfileFeature,
    allowEditUsername,
    allowEditEmail,
    allowEditPassword,
    allowModifyProfilePicture,
    allowDeleteMyUser,

    showSubscriberFeature,

    showCustomRolesFeature,
    allowAdminCreateCustomRole,
    allowAdminEditCustomRole,
    allowAdminDeleteCustomRole,

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

    setShowProfileFeature,
    setAllowEditUsername,
    setAllowEditEmail,
    setAllowEditPassword,
    setAllowModifyProfilePicture,
    setAllowDeleteMyUser,

    setShowSubscriberFeature,

    setShowCustomRolesFeature,
    setAllowAdminCreateCustomRole,
    setAllowAdminEditCustomRole,
    setAllowAdminDeleteCustomRole,

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
    toggleAllowDeleteUsers,

    toggleShowProfileFeature,
    toggleAllowEditUsername,
    toggleAllowEditEmail,
    toggleAllowEditPassword,
    toggleAllowEditProfileImage,
    toggleAllowDeleteMyUser,

    toggleShowSubscriberFeature,

    toggleShowCustomRolesFeature,
    toggleAllowAdminCreateCustomRole,
    toggleAllowAdminEditCustomRole,
    toggleAllowAdminDeleteCustomRole
  };

  // console.log("postFeatures in Global Provider", postFeatures)
  // console.log("allowManageRoles", allowManageRoles)
  // console.log("allowModifyProfilePicture", allowModifyProfilePicture)
  // console.log("showProfileFeature", showProfileFeature)
  // console.log("allowEditEmail", allowEditEmail)

  return (
    <GlobalContext.Provider value={{
      postFeatures,
      error,
      isLoading
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
