const pool = require('../config/db');

// Function to get all posts (is_deleted false), is_private only if I'm the sender

const getAllPosts = async (req, res) => {
  try {
    const loggedInUser = req.query.loggedInUser;
    const filteredUsername = req.query.filterUsername;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default to 20 posts per page if not provided
    let offset = (page - 1) * limit;// Calculate the offset for pagination

    // Ensure offset is an integer (avoid any BigInt confusion)
    offset = Number(offset); // Explicitly cast to a number to avoid any type issues

    if (!loggedInUser) {
      return res.status(400).json({ error: 'Missing or invalid loggedInUser ID.' });
    }

    // Step 1: Resolve filteredUsername to filteredUserId using LIKE
    let filteredUserIdCondition = '';
    let queryParams = [loggedInUser, offset, limit]; 

    if (filteredUsername) {
      // Use LIKE for partial matching on username
      filteredUserIdCondition = `
        AND sender IN (
          SELECT user_id 
          FROM users 
          WHERE username LIKE $4
        )
      `;
      queryParams.push(`%${filteredUsername}%`); // Adds the wildcard to search partially
    }

    // Step 2: Modify the SQL query to include the filteredUserIdCondition if it exists
    const query = `
      SELECT * 
      FROM posts
      WHERE 
        is_deleted = FALSE 
        AND (
          visibility = 'public'
          OR (visibility = 'private' AND sender = $1)
          OR (
            visibility = 'followers'
            AND (
              sender = $1
              OR sender IN (
                SELECT followee_id
                FROM followers
                WHERE follower_id = $1 AND status = 'accepted'
              )
            )
          )
        )
        AND NOT EXISTS (
          SELECT 1
          FROM muted
          WHERE 
            (muter = $1 AND mutee = posts.sender AND mute = TRUE)
            OR (mutee = $1 AND muter = posts.sender AND mute = TRUE)
        )
        ${filteredUserIdCondition}
      ORDER BY date DESC
      LIMIT $3 OFFSET $2;
      ;
    `;

    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to get posts by a specific user (is_deleted false)
const getPostsById = async (req, res) => {
  try {
// console.log("req.params", req.params)
    const postId = req.params.postId;
   
    // console.log("postId", postId)

    // Query to get posts from a specific user, excluding deleted posts
    const query = `
      SELECT * 
      FROM posts 
      WHERE id = $1
      ORDER BY date DESC;
    `;
    const params = [postId];

    // Execute the query
    const result = await pool.query(query, params);

    // Return the posts if found
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to mark a post as deleted (soft delete)
const markPostAsDeleted = async (req, res) => {
  const { id } = req.params;
  const { loggedInUser } = req.body; // Logged-in user ID from the request body

  try {
    // First, fetch the sender of the post
    const postResult = await pool.query(
      `SELECT sender FROM posts WHERE id = $1;`,
      [id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const post = postResult.rows[0];

    // Ensure that the logged-in user is the sender of the post
    if (post.sender !== loggedInUser) {
      return res.status(403).json({ error: 'You can only delete your own posts.' });
    }

    // Mark the post as deleted (soft delete)
    const result = await pool.query(
      `
      UPDATE posts
      SET is_deleted = TRUE
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found or already marked as deleted.' });
    }

    res.status(200).json({ message: 'Post marked as deleted successfully.' });
  } catch (error) {
    console.error('Error marking post as deleted:', error);
    res.status(500).json({ error: 'Internal server error while marking post as deleted.' });
  }
};

// Function to create a new post
const writePost = async (req, res) => {
  const { content, visibility, loggedInUser } = req.body; // Destructure the incoming data
console.log("hit here")
  try {
    // Validate input fields
    if (!content || !visibility || !loggedInUser) {
      return res.status(400).json({ error: 'Content, visibility, and loggedInUser are required.' });
    }

    // Validate that the loggedInUser exists in the database (optional but a good practice)
    const userCheckQuery = `SELECT user_id FROM users WHERE user_id = $1;`;
    const userCheckResult = await pool.query(userCheckQuery, [loggedInUser]);

    if (userCheckResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid logged-in user.' });
    }

    // Insert the new post into the posts table
    const query = `
      INSERT INTO posts (content, sender, visibility, date, is_deleted)
      VALUES ($1, $2, $3, NOW(), FALSE)
      RETURNING *;
    `;
    const params = [content, loggedInUser, visibility];

    const result = await pool.query(query, params);

    // Return the newly created post
    const newPost = result.rows[0];
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error while creating the post.' });
  }
};

const getPostReactionsCount = async (req, res) => {
  try {
    // console.log("hit controller getPostReactionsCount")

    const postId = Number(req.query.postId)
    const currentUserId = req.query.loggedInUserId;

    const query = `
      SELECT *
      FROM posts_reactions pr
      JOIN users u ON u.user_id = pr.user_id
      LEFT JOIN muted m ON m.muter = $2 AND m.mutee = u.user_id
      WHERE pr.post_id = $1
        AND (m.mute IS NULL OR m.mute = FALSE);
    `;

    const params = [postId, currentUserId];

    // Execute the query
    const result = await pool.query(query, params);
    

    // Return the posts if found
    res.status(200).json(result.rows.length);
  } catch (error) {
    console.error('Error retrieving post reactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostCommentsReactionsCount = async (req, res) => {
  try {
    // console.log("hit controller getPostReactionsCount")

    const commentId = Number(req.query.commentId)
    const currentUserId = Number(req.query.loggedInUserId);

    // console.log("commentId", commentId)
    // console.log("currentUserId", currentUserId)

    const query = `
      SELECT *
      FROM posts_comments_reactions pc
      JOIN users u ON u.user_id = pc.user_id
      LEFT JOIN muted m ON m.muter = $2 AND m.mutee = u.user_id
      WHERE pc.comment_id = $1
        AND (m.mute IS NULL OR m.mute = FALSE);
    `;

    const params = [commentId, currentUserId];

    // Execute the query
    const result = await pool.query(query, params);
    
// console.log("result.rows", result.rows)
    // Return the posts if found
    res.status(200).json(result.rows.length);
  } catch (error) {
    console.error('Error retrieving post reactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostCommentsCount = async (req, res) => {
  try {
    // console.log("hit controller getPostCommentsCount")

    const postId = Number(req.query.postId)
    const loggedInUserId = req.query.loggedInUserId


    const query = `
      SELECT *
      FROM posts_comments pc
      JOIN users u ON u.user_id = pc.commenter
      LEFT JOIN muted m ON m.muter = $2 AND m.mutee = u.user_id
      WHERE pc.post_id = $1
      AND pc.is_deleted = FALSE
        AND (m.mute IS NULL OR m.mute = FALSE);
    `;

    const params = [postId, loggedInUserId];

    // Execute the query
    const result = await pool.query(query, params);

    // Return the posts if found
    res.status(200).json(result.rows.length);
  } catch (error) {
    console.error('Error retrieving post comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostComments = async (req, res) => {
  try {
    // console.log("hit controller getPostCommentsCount")
// console.log("req.query", req.query)
  
const postId = Number(req.query.postId);
const currentUserId = req.query.loggedInUserId;


const query = `
  SELECT 
    pc.*, 
    u.username 
  FROM posts_comments pc
  JOIN users u ON u.user_id = pc.commenter
  LEFT JOIN muted m1 ON m1.muter = $2 AND m1.mutee = u.user_id
  WHERE pc.post_id = $1
  AND pc.is_deleted = FALSE
    AND (m1.mute IS NULL OR m1.mute = FALSE)
  ORDER BY pc.date DESC;
`;

const result = await pool.query(query, [postId, currentUserId]);

    // Execute the query

// console.log("result", result.rows)
    // Return the posts if found
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving post comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to create a new comment
const writePostComment = async (req, res) => {
  const { newMessage, loggedInUser, postId } = req.body; // Destructure the incoming data

  const now = new Date();

  try {
    // Validate input fields
    if (!newMessage || !loggedInUser) {
      return res.status(400).json({ error: 'Message  and loggedInUser are required.' });
    }

    // Validate that the loggedInUser exists in the database (optional but a good practice)
    const userCheckQuery = `SELECT user_id FROM users WHERE user_id = $1;`;
    const userCheckResult = await pool.query(userCheckQuery, [loggedInUser]);

    if (userCheckResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid logged-in user.' });
    }

    // Insert the new post into the posts table
    const query = `
      INSERT INTO posts_comments (post_id, commenter, content, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const params = [postId, loggedInUser, newMessage, now];

    const result = await pool.query(query, params);

    // Return the newly created post
    const newPost = result.rows[0];
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error while creating the post.' });
  }
};

const getPostReactionsData = async (req, res) => {
  try {
    // console.log("hit controller getPostCommentsCount")
// console.log("req.query", req.query)
    const postId = Number(req.query.postId)
    const currentUserId = req.query.loggedInUserId;

    const query = `
      SELECT 
        pr.*, 
        u.username 
      FROM posts_reactions pr
      JOIN users u ON u.user_id = pr.user_id
      LEFT JOIN muted m ON m.muter = $2 AND m.mutee = u.user_id
      WHERE pr.post_id = $1
        AND (m.mute IS NULL OR m.mute = FALSE)
      ORDER BY pr.date DESC;
    `;

    const params = [postId, currentUserId];

    // Execute the query
    const result = await pool.query(query, params);

    // Return the posts if found
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving post comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

getPostCommentsReactionsData = async (req, res) => {
  try {
    // console.log("hit controller getPostCommentsReactionsData")
// console.log("req.query", req.query)
    const commentId = Number(req.query.commentId)
    const currentUserId = Number(req.query.loggedInUserId);

// console.log("commentId", commentId)
// console.log("currentUserId", currentUserId)

    const query = `
      SELECT 
        pcr.*, 
        u.username 
      FROM posts_comments_reactions pcr
      JOIN users u ON u.user_id = pcr.user_id
      LEFT JOIN muted m ON m.muter = $2 AND m.mutee = u.user_id
      WHERE pcr.comment_id = $1
        AND (m.mute IS NULL OR m.mute = FALSE)
      ORDER BY pcr.date DESC;
    `;

    const params = [commentId, currentUserId];

    // Execute the query
    const result = await pool.query(query, params);
// console.log("result.rows", result.rows)
    // Return the posts if found
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving post comments reactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendReaction = async (req, res) => {
  const { loggedInUserId, postId, reactionType } = req.body; 

  try {
    // Step 1: Validate the input data
    if (!loggedInUserId || !postId) {
      return res.status(400).json({ error: 'Logged-in user and postId are required.' });
    }

    if (!reactionType) {
      return res.status(400).json({ error: 'Reaction type is required.' });
    }

    // Step 2: Validate that the loggedInUserId exists in the database
    const userCheckQuery = `SELECT user_id FROM users WHERE user_id = $1;`;
    const userCheckResult = await pool.query(userCheckQuery, [loggedInUserId]);

    if (userCheckResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid logged-in user.' });
    }

    if (reactionType === 'remove-reaction') {
      // Step 3: Remove the reaction if "remove-reaction" is passed
      const deleteReactionQuery = `
        DELETE FROM posts_reactions 
        WHERE user_id = $1 AND post_id = $2
        RETURNING *;
      `;
      const deleteParams = [loggedInUserId, postId];
      const deleteResult = await pool.query(deleteReactionQuery, deleteParams);

      if (deleteResult.rows.length === 0) {
        return res.status(200).json({
          message: 'No reaction found to remove',
        });
      }

      return res.status(200).json({
        message: 'Reaction removed successfully.',
      });
    } else {
      // Step 4: Check if the user has already reacted to this post
      const checkReactionQuery = `
        SELECT * 
        FROM posts_reactions 
        WHERE user_id = $1 AND post_id = $2;
      `;
      const checkReactionResult = await pool.query(checkReactionQuery, [loggedInUserId, postId]);

      // Step 5: If a reaction exists, update it. Otherwise, insert a new one.
      if (checkReactionResult.rows.length > 0) {
        // If the reaction already exists, we update the reaction_type
        const updateReactionQuery = `
          UPDATE posts_reactions 
          SET reaction_type = $1, date = NOW()
          WHERE user_id = $2 AND post_id = $3
          RETURNING *;
        `;
        const updateParams = [reactionType, loggedInUserId, postId];
        const updateResult = await pool.query(updateReactionQuery, updateParams);

        return res.status(200).json({
          message: 'Reaction updated successfully.',
          reaction: updateResult.rows[0], // Return the updated reaction details
        });
      } else {
        // If no reaction exists, insert the new reaction
        const insertReactionQuery = `
          INSERT INTO posts_reactions (user_id, post_id, reaction_type, date)
          VALUES ($1, $2, $3, NOW())
          RETURNING *;
        `;
        const insertParams = [loggedInUserId, postId, reactionType];
        const insertResult = await pool.query(insertReactionQuery, insertParams);

        return res.status(201).json({
          message: 'Reaction added successfully.',
          reaction: insertResult.rows[0], // Return the newly added reaction details
        });
      }
    }

  } catch (error) {
    console.error('Error sending reaction:', error);
    res.status(500).json({ error: 'Internal server error while sending the reaction.' });
  }
};

const sendCommentReaction = async (req, res) => {
  const { loggedInUserId, commentId, reactionType } = req.body; 

  try {
    // Step 1: Validate the input data
    if (!loggedInUserId || !commentId) {
      return res.status(400).json({ error: 'Logged-in user and commentId are required.' });
    }

    if (!reactionType) {
      return res.status(400).json({ error: 'Reaction type is required.' });
    }

    // Step 2: Validate that the loggedInUserId exists in the database
    const userCheckQuery = `SELECT user_id FROM users WHERE user_id = $1;`;
    const userCheckResult = await pool.query(userCheckQuery, [loggedInUserId]);

    if (userCheckResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid logged-in user.' });
    }

    if (reactionType === 'remove-reaction') {

      // Step 3: Remove the reaction if "remove-reaction" is passed
      const deleteReactionQuery = `
        DELETE FROM posts_comments_reactions 
        WHERE user_id = $1 AND comment_id = $2
        RETURNING *;
      `;
      const deleteParams = [loggedInUserId, commentId];
      const deleteResult = await pool.query(deleteReactionQuery, deleteParams);

      if (deleteResult.rows.length === 0) {
        return res.status(200).json({
          message: 'No reaction found to remove',
        });
      }

      return res.status(200).json({
        message: 'Reaction removed successfully.',
      });
    } else {
      // Step 4: Check if the user has already reacted to this post
      const checkReactionQuery = `
        SELECT * 
        FROM posts_comments_reactions
        WHERE user_id = $1 AND comment_id = $2;
      `;
      const checkReactionResult = await pool.query(checkReactionQuery, [loggedInUserId, commentId]);

      // Step 5: If a reaction exists, update it. Otherwise, insert a new one.
      if (checkReactionResult.rows.length > 0) {
        // If the reaction already exists, we update the reaction_type
        const updateReactionQuery = `
          UPDATE posts_comments_reactions
          SET reaction_type = $1, date = NOW()
          WHERE user_id = $2 AND comment_id = $3
          RETURNING *;
        `;
        const updateParams = [reactionType, loggedInUserId, commentId];
        const updateResult = await pool.query(updateReactionQuery, updateParams);

        return res.status(200).json({
          message: 'Reaction updated successfully.',
          reaction: updateResult.rows[0], // Return the updated reaction details
        });
      } else {
        // If no reaction exists, insert the new reaction
        const insertReactionQuery = `
          INSERT INTO posts_comments_reactions(user_id, comment_id, reaction_type, date)
          VALUES ($1, $2, $3, NOW())
          RETURNING *;
        `;
        const insertParams = [loggedInUserId, commentId, reactionType];
        const insertResult = await pool.query(insertReactionQuery, insertParams);

        return res.status(201).json({
          message: 'Reaction added successfully.',
          reaction: insertResult.rows[0], // Return the newly added reaction details
        });
      }
    }

  } catch (error) {
    console.error('Error sending comment reaction:', error);
    res.status(500).json({ error: 'Internal server error while sending the reaction.' });
  }
};

// Function to mark a comment as deleted (soft delete)
const markCommentAsDeleted = async (req, res) => {
  const { id } = req.params;
  const { loggedInUserId } = req.body; // Logged-in user ID from the request body

// console.log("req.body", req.body)

  try {
    // First, fetch the sender of the post
    const commentResult = await pool.query(
      `SELECT commenter FROM posts_comments WHERE id = $1;`,
      [id]
    );

    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    const comment = commentResult.rows[0];

// console.log("comment", comment)

    // Ensure that the logged-in user is the sender of the post
    if (comment.commenter !== loggedInUserId) {
      return res.status(403).json({ error: 'You can only delete your own comments.' });
    }

    // Mark the post as deleted (soft delete)
    const result = await pool.query(
      `
      UPDATE posts_comments
      SET is_deleted = TRUE
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found or already marked as deleted.' });
    }

    res.status(200).json({ message: 'Comment marked as deleted successfully.' });
  } catch (error) {
    console.error('Error marking comment as deleted:', error);
    res.status(500).json({ error: 'Internal server error while marking comment as deleted.' });
  }
};


module.exports = {
  getAllPosts,
  getPostsById,
  markPostAsDeleted,
  writePost,
  getPostReactionsCount,
  getPostCommentsCount,
  getPostComments,
  writePostComment,
  getPostReactionsData,
  sendReaction,
  getPostCommentsReactionsCount,
  getPostCommentsReactionsData,
  sendCommentReaction,
  markCommentAsDeleted
};
