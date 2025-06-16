const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const pool = require('../../config/db');
const verifyRoles = require('../../middleware/verifyRoles');

const checkPostFeatureAccess = (action) => {
  return async (req, res, next) => {
    try {
      // Fetch global and admin settings
      const [globalResult, adminResult] = await Promise.all([
        pool.query(`
          SELECT 
            show_posts_feature,
            allow_user_post,
            allow_admin_post,
            allow_post_interactions,
            allow_comments,
            allow_post_reactions,
            allow_comment_reactions,
            allow_delete_posts,
            allow_delete_comments
          FROM global_provider_settings
          LIMIT 1;
        `),
        pool.query(`
          SELECT 
            show_posts_feature,
            allow_user_post,
            allow_admin_post,
            allow_post_interactions,
            allow_comments,
            allow_post_reactions,
            allow_comment_reactions,
            allow_delete_posts,
            allow_delete_comments
          FROM admin_settings
          LIMIT 1;
        `)
      ]);

      const global = globalResult.rows[0];
      const admin = adminResult.rows[0];

      const featureEnabled = (feature) => {
        return global[feature] && admin[feature];
      };

      let allowedRoles = [];

      const fetchRoles = async () => {
        const rolesResult = await pool.query(`SELECT role_name FROM roles`);
        return rolesResult.rows.map(role => role.role_name);
      };

      switch (action) {
        case 'view-posts':
          allowedRoles = featureEnabled('show_posts_feature')
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'write-posts':
          const userCanPost = featureEnabled('allow_user_post');
          const adminCanPost = featureEnabled('allow_admin_post');

          if (userCanPost && adminCanPost) {
            allowedRoles = await fetchRoles();
          } else if (!userCanPost && adminCanPost) {
            allowedRoles = ['Admin', 'SuperAdmin'];
          } else if (!userCanPost && !adminCanPost) {
            allowedRoles = ['SuperAdmin', 'Admin'];
          } else if (userCanPost && !adminCanPost) {
            // All roles minus Admins (assuming that's what you want)
            const allRoles = await fetchRoles();
            allowedRoles = allRoles.filter(role => role !== 'Admin'); // Keep SuperAdmin
          }
          break;

        case 'view-comments':
        case 'write-comments':
          allowedRoles = featureEnabled('allow_comments')
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'post-reactions-send':
        case 'post-reactions-data':
          allowedRoles = featureEnabled('allow_post_reactions')
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'comment-reactions-send':
        case 'comment-reactions-data':
          allowedRoles = featureEnabled('allow_comment_reactions')
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'delete-post':
          allowedRoles = featureEnabled('allow_delete_posts')
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'delete-comment':
          allowedRoles = featureEnabled('allow_delete_comments')
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        default:
          allowedRoles = ['SuperAdmin'];
      }

      verifyRoles(...allowedRoles)(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// Posts
router.get('/all', checkPostFeatureAccess('view-posts'), postsController.getAllPosts);
router.get('/:postId', checkPostFeatureAccess('view-posts'), postsController.getPostsById);
router.post('/send', checkPostFeatureAccess('write-posts'), postsController.writePost);

// Comments
router.get('/comments/data', checkPostFeatureAccess('view-comments'), postsController.getPostComments);
router.get('/comments/count', checkPostFeatureAccess('view-comments'), postsController.getPostCommentsCount);
router.post('/comments/send', checkPostFeatureAccess('write-comments'), postsController.writePostComment);

// Post Reactions
router.get('/reactions/data', checkPostFeatureAccess('post-reactions-data'), postsController.getPostReactionsData);
router.get('/reactions/count', checkPostFeatureAccess('post-reactions-data'), postsController.getPostReactionsCount);
router.post('/reactions/send', checkPostFeatureAccess('post-reactions-send'), postsController.sendReaction);

// Comment Reactions
router.get('/comments/reactions/data', checkPostFeatureAccess('comment-reactions-data'), postsController.getPostCommentsReactionsData);
router.get('/comments/reactions/count', checkPostFeatureAccess('comment-reactions-data'), postsController.getPostCommentsReactionsCount);
router.post('/comments/reactions/send', checkPostFeatureAccess('comment-reactions-send'), postsController.sendCommentReaction);

// Delete
router.put('/delete/:id', checkPostFeatureAccess('delete-post'), postsController.markPostAsDeleted);
router.put('/comments/delete/:id', checkPostFeatureAccess('delete-comment'), postsController.markCommentAsDeleted);

module.exports = router;
