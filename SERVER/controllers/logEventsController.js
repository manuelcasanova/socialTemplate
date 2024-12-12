const pool = require('../config/db');

// Controller to get all events from role_change_logs
const getRoleChangeLogs = async (req, res) => {
  try {
    // Query to select all columns from the role_change_logs table
    const result = await pool.query('SELECT * FROM role_change_logs ORDER BY timestamp DESC');

    // Return the results as a JSON response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching role change logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getRoleChangeLogs,
};
