const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const pool = require('../../config/db');
const verifyRoles = require('../../middleware/verifyRoles');

const checkPostFeatureAccess = (action) => {
  return async (req, res, next) => {
    try {
      const settingsResult = await pool.query(`
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
      `);

      const settings = settingsResult.rows[0];

      let allowedRoles = [];

      // console.log("settings", settings)
      // console.log("allowedRoles", allowedRoles)

      const fetchRoles = async () => {
        const rolesResult = await pool.query(`SELECT role_name FROM roles`);
        return rolesResult.rows.map(role => role.role_name);
      };

      switch (action) {
        // View posts always depends on show_posts_feature
        case 'view-posts':
          allowedRoles = settings.show_posts_feature
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

          case 'write-posts':
            if (settings.allow_user_post && settings.allow_admin_post) {
              allowedRoles = await fetchRoles();
            } else if (!settings.allow_user_post && settings.allow_admin_post) {
              allowedRoles = ['Admin', 'SuperAdmin'];
            } else if (!settings.allow_user_post && !settings.allow_admin_post) {
              allowedRoles = ['SuperAdmin'];
            } else {
              allowedRoles = await fetchRoles(); // fallback in case both true
            }
            break;

        case 'view-comments':
          allowedRoles = settings.allow_comments
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'write-comments':
          allowedRoles = settings.allow_comments
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'post-reactions-send':
        case 'post-reactions-data':
          allowedRoles = settings.allow_post_reactions
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'comment-reactions-send':
        case 'comment-reactions-data':
          allowedRoles = settings.allow_comment_reactions
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'delete-post':
          allowedRoles = settings.allow_delete_posts
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        case 'delete-comment':
          allowedRoles = settings.allow_delete_comments
            ? await fetchRoles()
            : ['SuperAdmin'];
          break;

        default:
          allowedRoles = ['SuperAdmin']; // Fallback
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
