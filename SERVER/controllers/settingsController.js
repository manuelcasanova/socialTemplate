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
        allow_flag_posts
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
  toggleAllowFlagPosts
};


