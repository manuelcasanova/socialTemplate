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


module.exports = {
    getAllUsers,
    getMutedUsers,
    muteUser,
    unmuteUser,
    getFolloweeData,
    getFollowersData,
    getFollowersAndFolloweeData,
    getPendingSocialRequests
};
