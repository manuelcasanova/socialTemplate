const pool = require('../config/db');

const getGlobalProviderSettings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        show_posts_feature,
        allow_user_post,
        allow_admin_post,
        allow_comments,
        allow_post_reactions,
        allow_comment_reactions
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

module.exports = {
  getGlobalProviderSettings,
  toggleShowPostsFeature
};


