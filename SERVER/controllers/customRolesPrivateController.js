const pool = require('../config/db');

// PUT /custom-roles-private/:id
const updateCustomRole = async (req, res) => {
  const { id } = req.params;
  const { role_name, userId } = req.body;

  const trimmedName = role_name.trim();

  if (!role_name || !/^[A-Za-z0-9 _-]{1,25}$/.test(trimmedName)) {
    return res.status(400).json({ message: 'Invalid role name.' });
  }

  try {
    // Step 1: Check if the role exists and fetch the `created_by` user
    const { rows: roleRows } = await pool.query(
      'SELECT role_name, created_by FROM roles WHERE role_id = $1',
      [id]
    );

    if (roleRows.length === 0) {
      return res.status(404).json({ message: 'Role not found.' });
    }

    const { role_name: oldRoleName, created_by } = roleRows[0];

    // Step 2: Check if the user is the creator or a SuperAdmin
    const { rowCount: superAdminCount } = await pool.query(
      'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = (SELECT role_id FROM roles WHERE role_name = $2)',
      [userId, 'SuperAdmin']
    );

    if (created_by !== userId && superAdminCount === 0) {
      return res.status(403).json({ message: 'Custom roles can only be updated by the user who created them or by an administrator with a higher tier of access.' });
    }

    // Step 3: Check if the role name already exists (case-insensitive)
    const existing = await pool.query(
      'SELECT * FROM roles WHERE LOWER(role_name) = LOWER($1) AND role_id != $2',
      [trimmedName, id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'ROLE_EXISTS',
        message: 'A role with this name already exists.'
      });
    }

    // Step 4: Update the role name
    const { rows: updatedRoleRows } = await pool.query(
      'UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *',
      [trimmedName, id]
    );

    if (updatedRoleRows.length === 0) {
      return res.status(404).json({ message: 'Role not found during update.' });
    }

    const updatedRole = updatedRoleRows[0];

// Step 5: Insert a log entry for the update into role_admin_logs
await pool.query(
  `INSERT INTO role_admin_logs (role_id, old_role_id, old_role_name, new_role_name, action_type, performed_by)
   VALUES ($1, $1, $2, $3, 'updated', $4)`,
  [id, oldRoleName, trimmedName, userId]
);

    res.status(200).json(updatedRole);

  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Server error while updating role.' });
  }
};


// DELETE /custom-roles-private/:id
const deleteCustomRole = async (req, res) => {
  const { id } = req.params;
  const userId = Number(req.query.userId);


  const client = await pool.connect();
  try {

    await client.query('BEGIN');

    // Step 1: Fetch the role's creator information
    const { rows } = await pool.query(
      'SELECT role_id, role_name, created_by FROM roles WHERE role_id = $1',
      [id]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Role not found.' });
    }

    const { role_name, created_by } = rows[0];


    // Step 2: Check if the user is the creator or a SuperAdmin
    const { rowCount: superAdminCount } = await client.query(
      'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = (SELECT role_id FROM roles WHERE role_name = $2)',
      [userId, 'SuperAdmin']
    );

    // Check if the user is the creator or a SuperAdmin
    if (created_by !== userId && superAdminCount === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Custom roles can only be deleted by the user who created them or by an administrator with a higher tier of access.' });
    }

    // Step 3: Insert a log entry for the deletion into role_admin_logs
    await client.query(
      `INSERT INTO role_admin_logs (role_id, old_role_id, old_role_name, new_role_name, action_type, performed_by)
   VALUES (NULL, $1, $2, NULL, 'deleted', $3)`,
      [id, role_name, userId]
    );


    // Step 4: Proceed with deletion
    const { rowCount } = await client.query(
      'DELETE FROM roles WHERE role_id = $1',
      [id]
    );

    if (rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Role not found during deletion.' });
    }



    await client.query('COMMIT');

    res.sendStatus(204);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting role:', err);
    res.status(500).json({ message: 'Server error while deleting role.' });
  } finally {
    client.release();
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

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if the role name already exists (case-insensitive)
    const existing = await client.query(
      'SELECT * FROM roles WHERE LOWER(role_name) = LOWER($1)',
      [trimmedName]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'ROLE_EXISTS',
        message: 'A role with this name already exists.'
      });
    }

    // Insert the new role
    const result = await client.query(
      'INSERT INTO roles (role_name, is_system_role, created_by) VALUES ($1, $2, $3) RETURNING *',
      [trimmedName, false, userId]
    );

    const newRole = result.rows[0];

    // Insert into role_admin_logs
    await client.query(
      `INSERT INTO role_admin_logs (role_id, old_role_name, new_role_name, action_type, performed_by)
       VALUES ($1, NULL, $2, 'created', $3)`,
      [newRole.role_id, newRole.role_name, userId]
    );

    await client.query('COMMIT');
    res.status(201).json(newRole);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating role:', err);
    res.status(500).json({ message: 'Failed to create role.' });
  } finally {
    client.release();
  }
};



module.exports = {
  updateCustomRole,
  deleteCustomRole,
  createCustomRole
};
