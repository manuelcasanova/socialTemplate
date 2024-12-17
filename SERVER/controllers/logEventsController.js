const pool = require('../config/db');

// Controller to get all events from role_change_logs
const getRoleChangeLogs = async (req, res) => {
  try {
    // Extract query parameters
    const { modifier, recipient, modifier_id, recipient_id, role, action_type } = req.query;

    // Start with the base query, adding LEFT JOINs to get usernames for modifier and recipient
    let query = `
      SELECT 
        rcl.id, 
        rcl.user_that_modified AS modifier_id, 
        COALESCE(u1.username, '') AS modifier_username,  -- Return empty string if modifier_username is NULL
        rcl.user_modified AS recipient_id, 
        COALESCE(u2.username, '') AS recipient_username,  -- Return empty string if recipient_username is NULL
        rcl.role, 
        rcl.action_type, 
        rcl.timestamp
      FROM 
        role_change_logs rcl
      LEFT JOIN 
        users u1 ON rcl.user_that_modified = u1.user_id   -- Join to get the modifier username
      LEFT JOIN 
        users u2 ON rcl.user_modified = u2.user_id         -- Join to get the recipient username
      WHERE 
        1=1
    `;  // 1=1 is used to simplify adding conditions dynamically

    const queryParams = [];

    // Check and add filters only if they are provided (non-empty)
    if (modifier) {
      query += ` AND u1.username ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${modifier}%`);
    }

    if (recipient) {
      query += ` AND u2.username ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${recipient}%`);
    }

    if (modifier_id) {  // Only include if defined and not empty
      if (isNaN(modifier_id)) {
        return res.status(400).json({ error: 'Invalid modifier_id format' });
      }
      query += ` AND rcl.user_that_modified = $${queryParams.length + 1}`;
      queryParams.push(modifier_id);
    }

    if (recipient_id) {  // Only include if defined and not empty
      if (isNaN(recipient_id)) {
        return res.status(400).json({ error: 'Invalid recipient_id format' });
      }
      query += ` AND rcl.user_modified = $${queryParams.length + 1}`;
      queryParams.push(recipient_id);
    }

    if (role) {  // Only include if defined and not empty
      query += ` AND rcl.role = $${queryParams.length + 1}`;
      queryParams.push(role);
    }

    if (action_type) {  // Only include if defined and not empty
      query += ` AND rcl.action_type = $${queryParams.length + 1}`;
      queryParams.push(action_type);
    }

    // Add ORDER BY clause to sort by timestamp
    query += ` ORDER BY rcl.timestamp DESC`;

    // Execute the query with parameters
    const result = await pool.query(query, queryParams);

    // Return the results
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching role change logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getRoleChangeLogs,
};
