const express = require('express');
const router = express.Router();
const pool = require('../../config/db')

//Get all roles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT role_name FROM roles'); 
    const roles = result.rows.map(row => row.role_name);
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
});

module.exports = router;
