const pool = require('../config/db');

// Function to get all custom roles (is_system_role = false)
const getAllCustomRoles = async (req, res) => {
  try {
    const query = `
  SELECT *
      FROM roles
      WHERE is_system_role = $1
      ORDER BY
        CASE
          WHEN role_name ~ '^\\d+$' THEN 1
          ELSE 2
        END,
        CASE
          WHEN role_name ~ '^\\d+$' THEN role_name::int
          WHEN regexp_replace(role_name, '\\D', '', 'g') <> '' THEN regexp_replace(role_name, '\\D', '', 'g')::int
          ELSE NULL
        END,
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
