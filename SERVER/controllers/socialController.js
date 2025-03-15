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


        console.log("userId", userId)
        // Ensure that userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Query to fetch muted users
        const result = await pool.query(
            'SELECT * FROM muted WHERE mute = true AND (muter = $1 OR mutee = $1)', 
            [userId]
        );

        // If no muted users found, log a message
        if (result.rows.length === 0) {
            console.log('No muted users found');
        }

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


module.exports = {
    getAllUsers,
    getMutedUsers,
    muteUser,
    unmuteUser
};
