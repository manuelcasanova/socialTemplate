// controllers/loginHistory.js
const pool = require('../config/db');

const getLoginHistory = async (req, res) => {
  try {
    const {
      user_id,
      username,
      email,
      from_date,
      to_date,
      from_time,
      to_time,
      user_timezone
    } = req.query;

    let query = `
      SELECT
        lh.user_id,
        COALESCE(u.username, '') AS username,
        COALESCE(u.email, '') AS email,
        lh.login_time
      FROM login_history lh
      LEFT JOIN users u ON lh.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (user_id) {
      if (isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user_id format' });
      }
      params.push(user_id);
      query += ` AND lh.user_id = $${params.length}`;
    }

    if (username) {
      params.push(`%${username}%`);
      query += ` AND u.username ILIKE $${params.length}`;
    }

    if (email) {
      params.push(`%${email}%`);
      query += ` AND u.email ILIKE $${params.length}`;
    }

    if (from_date) {
      params.push(`${from_date} 00:00:00`);
      query += ` AND lh.login_time >= $${params.length}`;
    }
    if (to_date) {
      params.push(`${to_date} 23:59:59`);
      query += ` AND lh.login_time <= $${params.length}`;
    }

    // single-shift to user_timezone, then compare time
    if (from_time) {
      params.push(user_timezone, from_time);
      query += `
        AND (lh.login_time AT TIME ZONE $${params.length - 1})::time >= $${params.length}
      `;
    }
    if (to_time) {
      params.push(user_timezone, to_time);
      query += `
        AND (lh.login_time AT TIME ZONE $${params.length - 1})::time <= $${params.length}
      `;
    }

    query += ` ORDER BY lh.login_time DESC`;

// console.log('from_date', from_date)
// console.log('to_date', to_date)
// console.log('from_time', from_time)
// console.log('to_time', to_time)
// console.log('queryParams', query)


    const result = await pool.query(query, params);


    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching login history:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getLoginHistory };








// console.log('from_date', from_date)
// console.log('to_date', to_date)
// console.log('from_time', from_time)
// console.log('to_time', to_time)
// console.log('queryParams', queryParams)
