const express = require('express');
const {fetchRoles, fetchCustomRoles} = require('../../config/fetchRoles'); 
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  try {
    const roles = await fetchRoles(); 
    res.status(200).json(roles); 
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
});


router.get('/custom', async (req, res) => {
  try {
    const roles = await fetchCustomRoles(); 
    res.status(200).json(roles); 
  } catch (err) {
    console.error('Error fetching custom roles:', err);
    res.status(500).json({ message: 'Failed to fetch custom roles' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { role_name } = req.body;

  if (!role_name || !role_name.trim()) {
    return res.status(400).json({ message: 'Role name is required.' });
  }

  try {

    const result = await db.query(
      'UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *',
      [role_name.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Failed to update role.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {

    const result = await db.query(
      'DELETE FROM roles WHERE role_id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found.' });
    }

    res.status(200).json({ message: 'Role deleted successfully.' });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ message: 'Failed to delete role.' });
  }
});

router.post('/', async (req, res) => {
  const { role_name } = req.body;

  if (!role_name || !role_name.trim()) {
    return res.status(400).json({ message: 'Role name is required.' });
  }

  try {

    const result = await db.query(
      'INSERT INTO roles (role_name, is_system_role) VALUES ($1, $2) RETURNING *',
      [role_name.trim(), false] 
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ message: 'Failed to create role.' });
  }
});



module.exports = router;