const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const verifyRoles = require('../../middleware/verifyRoles');

// Common role set
const DEFAULT_ROLES = [
  'Admin',
  'SuperAdmin',
  'Moderator',
  'User_subscribed',
  'User_not_subscribed'
];

// Reusable role-checking middleware
const withDefaultRoles = async (req, res, next) => {
  try {
    verifyRoles(...DEFAULT_ROLES)(req, res, next);
  } catch (err) {
    next(err);
  }
};

// Routes
router.get('/all', withDefaultRoles, postsController.getAllPosts);
router.get('/:postId', withDefaultRoles, postsController.getPostsById);
router.put('/delete/:id', withDefaultRoles, postsController.markPostAsDeleted);
router.put('/comments/delete/:id', withDefaultRoles, postsController.markCommentAsDeleted);
router.post('/send', withDefaultRoles, postsController.writePost);
router.get('/reactions/count', withDefaultRoles, postsController.getPostReactionsCount);
router.get('/comments/reactions/count', withDefaultRoles, postsController.getPostCommentsReactionsCount);
router.get('/comments/count', withDefaultRoles, postsController.getPostCommentsCount);
router.get('/comments/data', withDefaultRoles, postsController.getPostComments);
router.post('/comments/send', withDefaultRoles, postsController.writePostComment);
router.get('/reactions/data', withDefaultRoles, postsController.getPostReactionsData);
router.get('/comments/reactions/data', withDefaultRoles, postsController.getPostCommentsReactionsData);
router.post('/reactions/send', withDefaultRoles, postsController.sendReaction);
router.post('/comments/reactions/send', withDefaultRoles, postsController.sendCommentReaction);

module.exports = router;
