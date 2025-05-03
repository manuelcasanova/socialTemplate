const pool = require('../config/db');

const getGlobalProviderSettings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        show_posts_feature,
        
        allow_user_post,
        allow_admin_post,

        allow_comments,

        allow_post_interactions,
        allow_post_reactions,
        allow_comment_reactions,
        allow_delete_posts,
        allow_flag_posts,
        allow_delete_comments,
        allow_flag_comments,

        show_messages_feature,
        allow_send_messages,
        allow_delete_messages,
        
        show_social_feature, 
        allow_follow, 
        allow_mute,

        allow_manage_roles,
        allow_delete_users,

        show_profile_feature,
        allow_edit_username,
        allow_edit_email,
        allow_edit_password,
        allow_delete_my_user,
        allow_modify_profile_picture

      FROM global_provider_settings
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No global provider settings found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleShowPostsFeature = async (req, res) => {
  try {
    const { show_posts_feature } = req.body;

    if (typeof show_posts_feature !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for show_posts_feature. Must be a boolean.' });
    }

    const result = await pool.query(
      `
      UPDATE global_provider_settings
      SET show_posts_feature = $1
      WHERE id = 1
      RETURNING *;
      `,
      [show_posts_feature]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowUserPost = async (req, res) => {
  try {
    const { allow_user_post } = req.body;

    if (typeof allow_user_post !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_user_post. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_user_post = $1 WHERE id = 1 RETURNING *;`,
      [allow_user_post]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_user_post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowAdminPost = async (req, res) => {
  try {
    const { allow_admin_post } = req.body;

    if (typeof allow_admin_post !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_admin_post. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_admin_post = $1 WHERE id = 1 RETURNING *;`,
      [allow_admin_post]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_admin_post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowPostInteractions = async (req, res) => {
  try {
    const { allow_post_interactions } = req.body;

    if (typeof allow_post_interactions !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_post_interactions. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_post_interactions = $1 WHERE id = 1 RETURNING *;`,
      [allow_post_interactions]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_post_interactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowComments = async (req, res) => {
  try {
    const { allow_comments } = req.body;

    if (typeof allow_comments !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_comments. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_comments = $1 WHERE id = 1 RETURNING *;`,
      [allow_comments]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowPostReactions = async (req, res) => {
  try {
    const { allow_post_reactions } = req.body;

    if (typeof allow_post_reactions !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_post_reactions. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_post_reactions = $1 WHERE id = 1 RETURNING *;`,
      [allow_post_reactions]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_post_reactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowCommentReactions = async (req, res) => {
  try {
    const { allow_comment_reactions } = req.body;

    if (typeof allow_comment_reactions !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_comment_reactions. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_comment_reactions = $1 WHERE id = 1 RETURNING *;`,
      [allow_comment_reactions]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_comment_reactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowDeletePosts = async (req, res) => {
  try {
    const { allow_delete_posts } = req.body;

    if (typeof allow_delete_posts !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_delete_posts. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_delete_posts = $1 WHERE id = 1 RETURNING *;`,
      [allow_delete_posts]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_delete_posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowFlagPosts = async (req, res) => {
  try {
    const { allow_flag_posts } = req.body;

    if (typeof allow_flag_posts !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_flag_posts. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_flag_posts = $1 WHERE id = 1 RETURNING *;`,
      [allow_flag_posts]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_flag_posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowDeleteComments = async (req, res) => {
  try {
    const { allow_delete_comments } = req.body;

    if (typeof allow_delete_comments !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_delete_comments. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_delete_comments = $1 WHERE id = 1 RETURNING *;`,
      [allow_delete_comments]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_delete_comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowFlagComments = async (req, res) => {
  try {
    const { allow_flag_comments } = req.body;

    if (typeof allow_flag_comments !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_flag_comments. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_flag_comments = $1 WHERE id = 1 RETURNING *;`,
      [allow_flag_comments]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_flag_comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleShowMessagesFeature = async (req, res) => {
  try {
    const { show_messages_feature } = req.body;

    if (typeof show_messages_feature !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for show_messages_feature. Must be a boolean.' });
    }

    const result = await pool.query(
      `
      UPDATE global_provider_settings
      SET show_messages_feature = $1
      WHERE id = 1
      RETURNING *;
      `,
      [show_messages_feature]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowSendMessages = async (req, res) => {
  try {
    const { allow_send_messages } = req.body;

    if (typeof allow_send_messages !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_send_messages. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_send_messages = $1 WHERE id = 1 RETURNING *;`,
      [allow_send_messages]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_send_messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowDeleteMessages = async (req, res) => {
  try {
    const { allow_delete_messages } = req.body;

    if (typeof allow_delete_messages !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_delete_messages. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_delete_messages = $1 WHERE id = 1 RETURNING *;`,
      [allow_delete_messages]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_delete_messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleShowSocialFeature = async (req, res) => {
  try {
    const { show_social_feature } = req.body;

    if (typeof show_social_feature !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for show_social_feature. Must be a boolean.' });
    }

    const result = await pool.query(
      `
      UPDATE global_provider_settings
      SET show_social_feature = $1
      WHERE id = 1
      RETURNING *;
      `,
      [show_social_feature]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating show_social_feature:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowFollow = async (req, res) => {
  try {
    const { allow_follow } = req.body;

    if (typeof allow_follow !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_follow. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_follow = $1 WHERE id = 1 RETURNING *;`,
      [allow_follow]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_follow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowMute = async (req, res) => {
  try {
    const { allow_mute } = req.body;

    if (typeof allow_mute !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_mute. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_mute = $1 WHERE id = 1 RETURNING *;`,
      [allow_mute]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_mute:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowManageRoles = async (req, res) => {
  try {
    const { allow_manage_roles } = req.body;

    if (typeof allow_manage_roles !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_manage_roles. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_manage_roles = $1 WHERE id = 1 RETURNING *;`,
      [allow_manage_roles]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_manage_roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowDeleteUsers = async (req, res) => {
  try {
    const { allow_delete_users } = req.body;

    if (typeof allow_delete_users !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_delete_users. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_delete_users = $1 WHERE id = 1 RETURNING *;`,
      [allow_delete_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_delete_users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleShowProfileFeature = async (req, res) => {
  try {
    const { show_profile_feature } = req.body;

    if (typeof show_profile_feature !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for show_profile_feature. Must be a boolean.' });
    }

    const result = await pool.query(
      `
      UPDATE global_provider_settings
      SET show_profile_feature = $1
      WHERE id = 1
      RETURNING *;
      `,
      [show_profile_feature]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowEditUsername = async (req, res) => {
  try {
    const { allow_edit_username } = req.body;

    if (typeof allow_edit_username !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_edit_username. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_edit_username = $1 WHERE id = 1 RETURNING *;`,
      [allow_edit_username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_edit_username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowEditEmail= async (req, res) => {
  try {
    const { allow_edit_email } = req.body;

    if (typeof allow_edit_email !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_edit_email. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_edit_email = $1 WHERE id = 1 RETURNING *;`,
      [allow_edit_email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_edit_email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowEditPassword = async (req, res) => {
  try {
    const { allow_edit_password } = req.body;

    if (typeof allow_edit_password !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_edit_password. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_edit_password = $1 WHERE id = 1 RETURNING *;`,
      [allow_edit_password]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_edit_password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowDeleteMyUser = async (req, res) => {
  try {
    const { allow_delete_my_user } = req.body;

    if (typeof allow_delete_my_user !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_delete_my_user. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_delete_my_user = $1 WHERE id = 1 RETURNING *;`,
      [allow_delete_my_user]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_delete_my_user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleAllowModifyProfilePicture = async (req, res) => {
  try {
    const { allow_modify_profile_picture } = req.body;

    if (typeof allow_modify_profile_picture !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for allow_modify_profile_picture. Must be a boolean.' });
    }

    const result = await pool.query(
      `UPDATE global_provider_settings SET allow_modify_profile_picture = $1 WHERE id = 1 RETURNING *;`,
      [allow_modify_profile_picture]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Global provider settings not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating allow_modify_profile_picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getGlobalProviderSettings,

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
  toggleAllowDeleteMyUser,
  toggleAllowModifyProfilePicture

};


