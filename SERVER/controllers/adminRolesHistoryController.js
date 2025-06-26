const pool = require('../config/db');

const getAdminRolesHistory = async (req, res) => {
  try {
    const query = `
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
      ORDER BY ral.timestamp DESC;
    `;

    const result = await pool.query(query);

    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin role history:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAdminRolesHistory };
