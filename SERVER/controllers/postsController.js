const pool = require('../config/db');

// Function to get all posts (is_deleted false), is_private only if I'm the sender

const getAllPosts = async (req, res) => {
  try {
    const loggedInUser = req.query.loggedInUser;
    const filteredUsername = req.query.filterUsername;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default to 20 posts per page if not provided
    const offset = (page - 1) * limit; // Calculate the offset for pagination

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
          WHERE username LIKE $2
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
    const userId = req.query.userId;

    // Query to get posts from a specific user, excluding deleted posts
    const query = `
      SELECT * 
      FROM posts 
      WHERE sender = $1 
      AND is_deleted = false
      ORDER BY date DESC;
    `;
    const params = [userId];

    // Execute the query
    const result = await pool.query(query, params);

    // Return the posts if found
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving posts by user:', error);
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

module.exports = {
  getAllPosts,
  getPostsById,
  markPostAsDeleted,
};
