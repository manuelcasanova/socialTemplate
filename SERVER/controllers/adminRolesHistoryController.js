const pool = require('../config/db');

const getAdminRolesHistory = async (req, res) => {
  try {
    const {
      performed_by,
      action,
      old_role_name,
      new_role_name,
      from_date,
      to_date,
      from_time,
      to_time,
      user_timezone
    } = req.query;

    let query = `
      SELECT
        ral.id,
        ral.role_id,
        ral.old_role_id,
        COALESCE(ral.old_role_name, '') AS old_role_name,
        COALESCE(ral.new_role_name, '') AS new_role_name,
        COALESCE(ral.action_type, '') AS action_type,
        ral.performed_by,
        u.username AS performed_by_username,
        ral.timestamp
      FROM role_admin_logs ral
      LEFT JOIN users u ON ral.performed_by = u.user_id
      WHERE 1=1
    `;

    const params = [];

    if (performed_by) {
      params.push(`%${performed_by}%`);
      query += ` AND u.username ILIKE $${params.length}`;
    }

    if (action) {
      params.push(action);
      query += ` AND ral.action_type = $${params.length}`;
    }

    if (old_role_name) {
      params.push(`%${old_role_name}%`);
      query += ` AND ral.old_role_name ILIKE $${params.length}`;
    }

    if (new_role_name) {
      params.push(`%${new_role_name}%`);
      query += ` AND ral.new_role_name ILIKE $${params.length}`;
    }

    // Date range filtering
    if (from_date) {
      params.push(`${from_date} 00:00:00`);
      query += ` AND ral.timestamp >= $${params.length}`;
    }
    if (to_date) {
      params.push(`${to_date} 23:59:59`);
      query += ` AND ral.timestamp <= $${params.length}`;
    }

    // Time-only filtering with timezone awareness
    if (from_time) {
      params.push(user_timezone, from_time);
      query += `
        AND (ral.timestamp AT TIME ZONE $${params.length - 1})::time >= $${params.length}
      `;
    }
    if (to_time) {
      params.push(user_timezone, to_time);
      query += `
        AND (ral.timestamp AT TIME ZONE $${params.length - 1})::time <= $${params.length}
      `;
    }

    query += ` ORDER BY ral.timestamp DESC`;

    // Optional: debug logs
    // console.log('Final Query:', query);
    // console.log('Params:', params);

    const result = await pool.query(query, params);

    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin role history:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAdminRolesHistory };
