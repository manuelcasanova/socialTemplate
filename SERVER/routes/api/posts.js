const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const pool = require('../../config/db');
const verifyRoles = require('../../middleware/verifyRoles');


// Dynamically check settings and determine allowed roles
const checkPostFeatureAccess = async (req, res, next) => {
  try {
    // Fetch post-related settings
    const settingsResult = await pool.query(`
      SELECT 
        show_posts_feature,
        allow_user_post,
        allow_post_interactions,
        allow_comments,
        allow_post_reactions,
        allow_comment_reactions,
        allow_delete_posts,
        allow_delete_comments
      FROM global_provider_settings
      LIMIT 1;
    `);

    const settings = settingsResult.rows[0];

    // Determine if all features are enabled
    const allPostSettingsEnabled = Object.values(settings).every(Boolean);

    let allowedRoles = [];

    if (allPostSettingsEnabled) {
      // If all features enabled, get all role names from `roles` table
      const rolesResult = await pool.query(`SELECT role_name FROM roles`);
      allowedRoles = rolesResult.rows.map(role => role.role_name);
    } else {
      // Only SuperAdmin is allowed
      allowedRoles = ['SuperAdmin'];
    }

    verifyRoles(...allowedRoles)(req, res, next);
  } catch (err) {
    next(err);
  }
};

// Routes
router.get('/all', postsController.getAllPosts);
router.get('/:postId', checkPostFeatureAccess, postsController.getPostsById);
router.put('/delete/:id', checkPostFeatureAccess, postsController.markPostAsDeleted);
router.put('/comments/delete/:id', checkPostFeatureAccess, postsController.markCommentAsDeleted);
router.post('/send', checkPostFeatureAccess, postsController.writePost);
router.get('/reactions/count', checkPostFeatureAccess, postsController.getPostReactionsCount);
router.get('/comments/reactions/count', checkPostFeatureAccess, postsController.getPostCommentsReactionsCount);
router.get('/comments/count', checkPostFeatureAccess, postsController.getPostCommentsCount);
router.get('/comments/data', checkPostFeatureAccess, postsController.getPostComments);
router.post('/comments/send', checkPostFeatureAccess, postsController.writePostComment);
router.get('/reactions/data', checkPostFeatureAccess, postsController.getPostReactionsData);
router.get('/comments/reactions/data', checkPostFeatureAccess, postsController.getPostCommentsReactionsData);
router.post('/reactions/send', checkPostFeatureAccess, postsController.sendReaction);
router.post('/comments/reactions/send', checkPostFeatureAccess, postsController.sendCommentReaction);

module.exports = router;
