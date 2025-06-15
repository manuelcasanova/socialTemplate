const pool = require('../config/db');

// PUT /custom-roles-private/:id
const updateCustomRole = async (req, res) => {
  const { id } = req.params;
  const { role_name } = req.body;

  const trimmedName = role_name.trim();

  if (!role_name || !/^[A-Za-z0-9 _-]{1,25}$/.test(trimmedName)) {
    return res.status(400).json({ message: 'Invalid role name.' });
  }

  try {
    // Check if the role name already exists (case-insensitive)
    const existing = await pool.query(
      'SELECT * FROM roles WHERE LOWER(role_name) = LOWER($1)',
      [trimmedName]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'ROLE_EXISTS',
        message: 'A role with this name already exists.'
      });
    }

    const { rows } = await pool.query(
      'UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *',
      [trimmedName, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Role not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Server error while updating role.' });
  }
};

// DELETE /custom-roles-private/:id
const deleteCustomRole = async (req, res) => {
  const { id } = req.params;
  const userId = Number(req.query.userId); 

  try {
    // Step 1: Fetch the role's creator information
    const { rows } = await pool.query(
      'SELECT created_by FROM roles WHERE role_id = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Role not found.' });
    }

    const { created_by } = rows[0];


    // Step 2: Check if the user is the creator or a SuperAdmin
    const { rowCount: superAdminCount } = await pool.query(
      'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = (SELECT role_id FROM roles WHERE role_name = $2)',
      [userId, 'SuperAdmin']
    );  

    // Check if the user is the creator or a SuperAdmin
    if (created_by !== userId && superAdminCount === 0) {
      return res.status(403).json({ message: 'Custom roles can only be deleted by the user who created them or by an administrator with a higher tier of access.' });
    }

    // Step 3: Proceed with deletion
    const { rowCount } = await pool.query(
      'DELETE FROM roles WHERE role_id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Role not found during deletion.' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ message: 'Server error while deleting role.' });
  }
};

// Create a new custom role
const createCustomRole = async (req, res) => {
  const { role_name, userId } = req.body;

  if (!role_name || !role_name.trim()) {
    return res.status(400).json({ message: 'Role name is required.' });
  }

  const trimmedName = role_name.trim();
  const roleNameRegex = /^[A-Za-z0-9 _-]{1,25}$/;

  if (!roleNameRegex.test(trimmedName)) {
    return res.status(400).json({
      message: 'Role name must be 1–25 characters long and contain only letters, numbers, spaces, hyphens, or underscores.'
    });
  }

  try {

    // Check if the role name already exists (case-insensitive)
    const existing = await pool.query(
      'SELECT * FROM roles WHERE LOWER(role_name) = LOWER($1)',
      [trimmedName]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'ROLE_EXISTS',
        message: 'A role with this name already exists.'
      });
    }

    const result = await pool.query(
      'INSERT INTO roles (role_name, is_system_role, created_by) VALUES ($1, $2, $3) RETURNING *',
      [trimmedName, false, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ message: 'Failed to create role.' });
  }
};


module.exports = {
  updateCustomRole,
  deleteCustomRole,
  createCustomRole
};
