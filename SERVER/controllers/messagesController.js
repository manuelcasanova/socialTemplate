const pool = require('../config/db');

// Function to get messages by id

const getMessagesById = async (req, res) => {
  try {
    
const loggedInUser = req.query.loggedInUser;
const userId = req.query.userId;

    // Start the base query
    let query = `
            SELECT *
            FROM user_messages 
            WHERE (sender = $1 OR receiver = $1)
            AND 
            (sender = $2 OR receiver = $2)
            ORDER BY date DESC;
        `;
    const params = [userId, loggedInUser];

    // Execute the query
    const result = await pool.query(query, params);

    // If no user found, log a message
    if (result.rows.length === 0) {
      console.log('No user found with the given ID');
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the username if found
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getMessagesById
};
