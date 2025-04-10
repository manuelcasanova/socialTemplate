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

        // Start the base query
        let query2 = `
        UPDATE user_messages
        SET status = 'read'
        WHERE receiver = $2
        AND sender = $1
    `;
const params2 = [userId, loggedInUser];

// Execute the query
await pool.query(query2, params2);

    // Return the username if found
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Send a message
const sendMessage = async (req, res, next) => {

  const sender = req.body.loggedInUser;
const receiver = Number(req.body.userId);
const newMessage = req.body.newMessage;
const now = new Date();

  try {

    if (newMessage !== "") {
      const addMessage = await pool.query(
        `
      INSERT INTO user_messages (content, receiver, sender, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
        [newMessage, receiver, sender, now]
      );
      res.json(addMessage.rows[0])
    } else {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }



  } catch (error) {
    console.error('Error sending a message:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getNewMessagesNotification = async (req, res) => {
  try {
    const loggedInUser = req.query.loggedInUser;

    // Fetch the most recent login time for the logged-in user
    const recentLoginQuery = `
      SELECT login_time
      FROM login_history
      WHERE user_id = $1
      ORDER BY login_time DESC
      LIMIT 1;
    `;
    // Fetch the second-most recent login time (if it exists)
    const secondRecentLoginQuery = `
      SELECT login_time
      FROM login_history
      WHERE user_id = $1
      ORDER BY login_time DESC
      LIMIT 1 OFFSET 1;
    `;

    // Execute the queries to get login times
    const recentLoginResult = await pool.query(recentLoginQuery, [loggedInUser]);
    const secondRecentLoginResult = await pool.query(secondRecentLoginQuery, [loggedInUser]);

    if (recentLoginResult.rows.length === 0) {
      // No login history found for the logged-in user
      return res.status(404).json({ message: 'Login history not found' });
    }

    const recentLoginTime = recentLoginResult.rows[0].login_time;
    let secondRecentLoginTime = null;

    // If there's a second recent login, use that
    if (secondRecentLoginResult.rows.length > 0) {
      secondRecentLoginTime = secondRecentLoginResult.rows[0].login_time;
    } else {
      // If no second login exists, use the most recent login as the reference
      secondRecentLoginTime = recentLoginTime;
    }

    // Fetch the senders who sent messages after the second-most recent login
    const messageQuery = `
      SELECT DISTINCT sender
      FROM user_messages
      WHERE receiver = $1
      AND date > $2
      AND is_deleted = FALSE
      AND status != 'read';
    `;
    const messageParams = [loggedInUser, secondRecentLoginTime];

    // Execute the query to get the senders
    const messageResult = await pool.query(messageQuery, messageParams);

    // If no messages are found, return an empty array
    if (messageResult.rows.length === 0) {
      return res.status(200).json([]); 
    }

    // Extract sender IDs from the result and send as an array
    const senderIds = messageResult.rows.map(row => row.sender);

    // Return the array of sender IDs
    res.status(200).json(senderIds); 
  } catch (error) {
    console.error('Error retrieving new messages notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark a message as deleted (soft delete)
const markMessageAsDeleted = async (req, res) => {
  const { id } = req.params;

  try {
    // Update the is_deleted flag instead of deleting the message entirely
    const result = await pool.query(
      `
      UPDATE user_messages
      SET is_deleted = TRUE
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found or already marked as deleted.' });
    }

    res.status(200).json({ message: 'Message marked as deleted successfully.' });
  } catch (error) {
    console.error('Error marking message as deleted:', error);
    res.status(500).json({ error: 'Internal server error while marking message as deleted.' });
  }
};





module.exports = {
  getMessagesById,
  sendMessage,
  getNewMessagesNotification,
  markMessageAsDeleted
};
