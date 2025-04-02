const pool = require('../config/db');

// Function to get all users

const getAllUsers = async (req, res) => {
  try {
    const { username } = req.query;

    // Start the base query
    let query = `
            SELECT u.user_id, u.username, u.is_active
            FROM users u
            WHERE u.is_active = true 
        `;
    const params = [];

    // Add filters to the query based on the req.query parameters
    if (username) {
      query += ` AND u.username ILIKE $${params.length + 1}`;
      params.push(`%${username}%`);  // Use ILIKE for case-insensitive matching
    }

    // Add the GROUP BY and execute the query
    query += `
            GROUP BY u.username, u.user_id
        `;

    // Execute the query
    const result = await pool.query(query, params);

    // If no users found, log a message
    if (result.rows.length === 0) {
      console.log('No users found');
    }

    // Return the result
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to get all muted users

const getMutedUsers = async (req, res) => {
  try {
    const { userId } = req.query;

    // Ensure that userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Query to fetch muted users
    const result = await pool.query(
      'SELECT * FROM muted WHERE mute = true AND (muter = $1 OR mutee = $1)',
      [userId]
    );

    // Return the result
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving muted users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mute user
const muteUser = async (req, res, next) => {
  const { userLoggedin, userId } = req.body;

  try {
    // Check if the record already exists in the 'muted' table
    const existingRecord = await pool.query(
      'SELECT * FROM muted WHERE muter = $1 AND mutee = $2',
      [userLoggedin, userId]
    );

    if (existingRecord.rows.length === 0) {
      // If record doesn't exist, insert a new record to mute the user
      await pool.query(
        'INSERT INTO muted (muter, mutee, mute) VALUES ($1, $2, true)',
        [userLoggedin, userId]
      );
      return res.status(200).json({ message: 'User muted successfully.' });
    } else {
      // If record exists, update the mute status to true (mute the user)
      await pool.query(
        'UPDATE muted SET mute = true WHERE muter = $1 AND mutee = $2',
        [userLoggedin, userId]
      );
      return res.status(200).json({ message: 'User muted successfully.' });
    }
  } catch (error) {
    console.error('Error muting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Unmute user
const unmuteUser = async (req, res, next) => {
  const { userLoggedin, userId } = req.body;

  try {
    // Check if the record already exists in the 'muted' table
    const existingRecord = await pool.query(
      'SELECT * FROM muted WHERE muter = $1 AND mutee = $2',
      [userLoggedin, userId]
    );

    if (existingRecord.rows.length === 0) {
      // If record doesn't exist, send a message indicating that the user is not muted
      return res.status(400).json({ message: 'User is not muted.' });
    } else {
      // If record exists, update the mute status to false (unmute the user)
      await pool.query(
        'UPDATE muted SET mute = false WHERE muter = $1 AND mutee = $2',
        [userLoggedin, userId]
      );
      return res.status(200).json({ message: 'User unmuted successfully.' });
    }
  } catch (error) {
    console.error('Error unmuting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Fetch followee data (users being followed by the logged-in user)
const getFolloweeData = async (req, res, next) => {
  const { userId } = req.query;

  try {
    // Query to fetch the users the logged-in user is following (followees)
    const followees = await pool.query(
      `SELECT * FROM followers 
      WHERE follower_id = $1 AND status = 'accepted' ORDER BY lastmodification DESC`,
      [userId]
    );

    // Return the list of followees
    return res.status(200).json(followees.rows);

  } catch (error) {
    console.error('Error fetching followee data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch followee data (users followed by the logged-in user)
const getFollowersData = async (req, res, next) => {
  const { userId } = req.query;

  try {
    const followers = await pool.query(
      `SELECT * FROM followers 
      WHERE followee_id = $1 AND status = 'accepted' ORDER BY lastmodification DESC`,
      [userId]
    );

    // Return the list of followees
    return res.status(200).json(followers.rows);

  } catch (error) {
    console.error('Error fetching followers data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch followee data (users followed by the logged-in user)
const getFollowersAndFolloweeData = async (req, res, next) => {
  const { userId } = req.query;


  try {
    const followersAndFollowee = await pool.query(
      `SELECT * FROM followers 
      WHERE follower_id = $1 OR followee_id = $1 ORDER BY lastmodification DESC`,
      [userId]
    );

    // Return the list of followees
    return res.status(200).json(followersAndFollowee.rows);

  } catch (error) {
    console.error('Error fetching followersAndFollowee data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch pending requests for social connection
const getPendingSocialRequests = async (req, res, next) => {
  const { userId } = req.query;

  try {
    const result = await pool.query(
      `SELECT lastmodification, newrequest, follower_id FROM followers WHERE followee_id = $1 AND status = 'pending' ORDER BY lastmodification DESC`,
      [userId]
    );

    const pendingUsers = result.rows.map(row => ({
      follower_id: row.follower_id,
      lastmodification: row.lastmodification,
      newrequest: row.newrequest
    })
    );

    // Return the list of followees
    return res.status(200).json(pendingUsers); //Or {pendingUsers}?

  } catch (error) {
    console.error('Error fetching pendingUsers data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Require to follow a user
const followUser = async (req, res, next) => {
  try {

    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const now = req.body.date || new Date(); // Use provided date or current date/time

    if (req.body.user) {
      // Attempt to update existing record
      const updateQuery = `
        UPDATE followers
        SET status = 'pending', lastmodification = $1, newrequest = true
        WHERE follower_id = $2 AND followee_id = $3
        RETURNING *
      `;
      const updateValues = [now, followerId, followeeId];

      // Execute update query
      const updateResult = await pool.query(updateQuery, updateValues);

      // Check if any rows were updated
      if (updateResult.rowCount > 0) {
        res.json(updateResult.rows[0]); // Return updated row
      } else {
        // If no rows were updated, insert new record
        const insertQuery = `
          INSERT INTO followers (follower_id, followee_id, status, lastmodification, newrequest)
          VALUES ($1, $2, 'pending', $3, true)
          RETURNING *
        `;
        const insertValues = [followerId, followeeId, now];

        // Execute insert query
        const insertResult = await pool.query(insertQuery, insertValues);
        res.json(insertResult.rows[0]); // Return inserted row
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (error) {
    console.error('Error requesting to follow a user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Cancel a follow request
const cancelFollowRequest = async (req, res, next) => {
  try {

    const { followeeId, followerId, user } = req.body; // Extract data from the request

    if (user) {
      // Check if the follow relationship exists before attempting to delete
      const checkQuery = `
        SELECT * FROM followers
        WHERE follower_id = $1 AND followee_id = $2
      `;
      const checkValues = [followerId, followeeId];

      // Execute the query to check if the follow exists
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rowCount === 0) {
        // If no follow request is found, return an error response
        return res.status(404).json({ error: "Follow request not found" });
      }

      // Proceed to delete the follow relationship
      const deleteQuery = `
        DELETE FROM followers
        WHERE follower_id = $1 AND followee_id = $2
        RETURNING *
      `;
      const deleteValues = [followerId, followeeId];

      // Execute the delete query
      const deleteResult = await pool.query(deleteQuery, deleteValues);

      if (deleteResult.rowCount > 0) {
        // Return the canceled follow relationship
        res.json(deleteResult.rows[0]);
      } else {
        // If no follow request was deleted, send an error response
        res.status(404).json({ error: "Follow request not found" });
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error('Error canceling follow request:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Unfollow a user
const unfollowUser = async (req, res, next) => {
  try {



    const { followeeId, followerId, user } = req.body; // Extract data from the request


    if (user) {
      // Check if the follow relationship exists before attempting to delete
      const checkQuery = `
        SELECT * FROM followers
        WHERE follower_id = $1 AND followee_id = $2
      `;
      const checkValues = [followerId, followeeId];

      // Execute the query to check if the follow exists
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rowCount === 0) {
        // If no connection found, return an error response
        return res.status(404).json({ error: "Social connection not found" });
      }

      // Proceed to delete the follow relationship
      const deleteQuery = `
        DELETE FROM followers
        WHERE follower_id = $1 AND followee_id = $2
        RETURNING *
      `;
      const deleteValues = [followerId, followeeId];

      // Execute the delete query
      const deleteResult = await pool.query(deleteQuery, deleteValues);

      if (deleteResult.rowCount > 0) {
        // Return the canceled follow relationship
        res.json(deleteResult.rows[0]);
      } else {
        // If no follow request was deleted, send an error response
        res.status(404).json({ error: "Social connection not found" });
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error('Error unfollowing user:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const approveFollowRequest = async (req, res, next) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const date = req.body.date || new Date();

    if (req.body.user) {
      // Attempt to update existing record
      const updateQuery = `
        UPDATE followers
        SET status = 'accepted', lastmodification = $1
        WHERE follower_id = $2 AND followee_id = $3
        RETURNING *
      `;
      const updateValues = [date, followeeId, followerId];

      // Execute update query
      const updateResult = await pool.query(updateQuery, updateValues);

      // Check if any rows were updated
      if (updateResult.rowCount > 0) {
        res.json(updateResult.rows[0]); // Return updated row
      } else {
        // If no rows were updated, insert new record
        const insertQuery = `
          INSERT INTO followers (follower_id, followee_id, status, lastmodification)
          VALUES ($1, $2, 'accepted', $3)
          RETURNING *
        `;
        const insertValues = [followerId, followeeId, date];

        // Execute insert query
        const insertResult = await pool.query(insertQuery, insertValues);
        res.json(insertResult.rows[0]); // Return inserted row
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get follow notifications for a user
const getFollowNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    // Ensure that userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get all follow requests where the last modification is later than the second last login
    const result = await pool.query(
      `WITH SecondLastLogin AS (
          SELECT user_id, login_time,
                 ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_time DESC) AS rn
          FROM login_history
        )
        SELECT DISTINCT f.*
        FROM followers f
        JOIN SecondLastLogin sll ON f.followee_id = sll.user_id
        WHERE f.lastmodification > (
            SELECT MAX(login_time)
            FROM SecondLastLogin
            WHERE user_id = f.followee_id AND rn = 2
          )
        AND f.followee_id = $1
        AND f.status = 'pending'
        ORDER BY f.lastmodification DESC`,
      [userId]
    );

    // Return the result
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving follow notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// const getFollowNotifications = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     console.log("hit socialController")

//     // Ensure that userId is provided
//     if (!userId) {
//       return res.status(400).json({ error: 'userId is required' });
//     }

//     // Get all follow requests pending approval or follow actions involving the user
//     const result = await pool.query(
//       `SELECT f.follower_id, f.followee_id, f.status, f.newrequest, 
//               f.lastmodification, u.username AS follower_username, 
//               u2.username AS followee_username
//        FROM followers f
//        JOIN users u ON u.user_id = f.follower_id
//        JOIN users u2 ON u2.user_id = f.followee_id
//        WHERE (f.follower_id = $1 OR f.followee_id = $1)
//        AND f.status = 'pending'
//        ORDER BY f.lastmodification DESC`,
//       [userId]
//     );

//     console.log("result.rows", result.rows)

//     // Return the result
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error retrieving follow notifications:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };




module.exports = {
  getAllUsers,
  getMutedUsers,
  muteUser,
  unmuteUser,
  getFolloweeData,
  getFollowersData,
  getFollowersAndFolloweeData,
  getPendingSocialRequests,
  followUser,
  cancelFollowRequest,
  unfollowUser,
  approveFollowRequest,
  getFollowNotifications
};
