const pool = require('../config/db');

// Function to get all custom roles (is_system_role = false)
const getAllCustomRoles = async (req, res) => {
  try {


const query = `
  SELECT *
  FROM roles
  WHERE is_system_role = $1
  ORDER BY
    CASE WHEN role_name ~ '^\\s*\\d+' THEN 0 ELSE 1 END,
    CASE WHEN role_name ~ '^\\s*\\d+' THEN regexp_replace(role_name, '^\\s*(\\d+).*$', '\\1')::int ELSE NULL END,
    role_name
`;

    const queryParams = [false];

    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving custom roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllCustomRoles
};
