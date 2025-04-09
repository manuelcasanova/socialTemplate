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

// Function to get user by id

const getUsernameByUserId = async (req, res) => {
  try {

    const userId = Number(req.query.userId);

    // Start the base query
    let query = `
            SELECT u.username
            FROM users u 
            wHERE u.user_id = $1
        `;
    const params = [userId];

    // Execute the query
    const result = await pool.query(query, params);

    // If no user found, log a message
    if (result.rows.length === 0) {
      console.log('No user found with the given ID');
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the username if found
    res.status(200).json({ username: result.rows[0].username });
  } catch (error) {
    console.error('Error retrieving username:', error);
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

    const now = new Date(); 

    // console.log("now new Date", new Date())

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
    const date = new Date();

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
                SELECT COALESCE(
               (SELECT MAX(login_time)
                FROM SecondLastLogin
                WHERE user_id = f.followee_id AND rn = 2),
               '1970-01-01' -- or another default value
           )
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

//Function to get all users that have messages and the timestamp of the last message

const getUsersWithMessages = async (req, res) => {
  try {
    const { userId, username } = req.query; // The logged-in user's ID and optional username from the request

    console.log("username", username);

    // Case 1: If username is provided (searching for a specific user), fetch users followed or following, regardless of message exchange
    if (username && username !== "") {
      const query = `
      SELECT u.user_id, u.username, 
             MAX(um.date) AS last_message_date
      FROM users u
      LEFT JOIN user_messages um
        ON (um.sender = u.user_id OR um.receiver = u.user_id)
      WHERE u.user_id != $1 -- Exclude the logged-in user
        AND (u.user_id IN (
              SELECT followee_id 
              FROM followers 
              WHERE follower_id = $1
              AND status = 'accepted'
            ) 
             OR u.user_id IN (
              SELECT follower_id 
              FROM followers 
              WHERE followee_id = $1
              AND status = 'accepted'
            ))
        AND u.username ILIKE $2 -- Match the username (case-insensitive)
      GROUP BY u.user_id, u.username
      ORDER BY last_message_date DESC NULLS LAST, u.username ASC;`;

      const result = await pool.query(query, [userId, `%${username}%`]);

      return res.status(200).json(result.rows);
    }

    // Case 2: If username is not provided, fetch users with whom messages have been exchanged
    const query = `
      SELECT u.user_id, u.username, 
             MAX(um.date) AS last_message_date
      FROM users u
      JOIN user_messages um
        ON (um.sender = u.user_id OR um.receiver = u.user_id)
      WHERE (um.sender = $1 OR um.receiver = $1)
        AND u.user_id != $1  -- Exclude your own user from the result
      GROUP BY u.user_id, u.username
      ORDER BY last_message_date DESC;
    `;

    const result = await pool.query(query, [userId]);

    // If no users found with messages, return an empty list
    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    // If users are found with messages, return them
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error retrieving users with messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




// const getUsersWithMessages = async (req, res) => {
//   try {
//     const { userId, username } = req.query; // The logged-in user's ID from the request

//     console.log("username", username)
//     // Query to fetch users who have exchanged messages with the logged-in user
//     const query = `
//  SELECT u.user_id, u.username, 
//        MAX(um.date) AS last_message_date
// FROM users u
// JOIN user_messages um
//     ON (um.sender = u.user_id OR um.receiver = u.user_id)
// WHERE (um.sender = $1 OR um.receiver = $1)
//   AND u.user_id != $1  -- Exclude your own user from the result
// GROUP BY u.user_id, u.username
// ORDER BY last_message_date DESC;

//   `;
  
    
//     const result = await pool.query(query, [userId]);

//     // If no users found, return a message
//     if (result.rows.length === 0) {
//       // console.log('No users found with messages');
//       return res.status(200).json([]);
//     }

//     // console.log("Users found with messages", result.rows)
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error retrieving users with messages:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };



module.exports = {
  getAllUsers,
  getUsernameByUserId,
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
  getFollowNotifications,
  getUsersWithMessages
};
