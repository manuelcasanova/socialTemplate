const pool = require('../config/db')

// Controller to get all login history
const getLoginHistory = async (req, res) => {
  try {
    const { user_id, username, email, from_date, to_date, from_time, to_time } = req.query;
    // Get login history
    let query = `
      SELECT 
        lh.user_id, 
        COALESCE(u.username, '') AS username,  
        COALESCE(u.email, '') AS email,
        lh.login_time
      FROM 
        login_history lh
      LEFT JOIN 
        users u ON lh.user_id = u.user_id  
      WHERE 
        1=1
    `;  // 1=1 is used to simplify adding conditions dynamically

    const queryParams = [];

    // Check and add filters if they are provided
    if (user_id) {
      if (isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user_id format' });
      }
      query += ` AND lh.user_id = $${queryParams.length + 1}`;
      queryParams.push(user_id);
    }

    if (username) {
      query += ` AND u.username ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${username}%`);
    }

    if (email) {
      query += ` AND u.email ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${email}%`);
    }


    if (from_date) {
      query += ` AND lh.login_time >= $${queryParams.length + 1}`;
      queryParams.push(`${from_date} 00:00:00`); // Assuming time starts from midnight for the from_date
    }

    if (to_date) {
      query += ` AND lh.login_time <= $${queryParams.length + 1}`;
      queryParams.push(`${to_date} 23:59:59`); // Assuming time ends at 11:59:59 PM for the to_date
    }


    if (from_time) {
      query += ` AND TO_CHAR(lh.login_time, 'HH24:MI') >= $${queryParams.length + 1}`;
      queryParams.push(from_time);
    }


    if (to_time) {
      query += ` AND TO_CHAR(lh.login_time, 'HH24:MI') <= $${queryParams.length + 1}`;
      queryParams.push(to_time);
    }

    // Add ORDER BY clause to sort by login time (descending order)
    query += ` ORDER BY lh.login_time DESC`;

    // Execute the query with parameters
    const result = await pool.query(query, queryParams);

    // Return the results
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getLoginHistory,
};
