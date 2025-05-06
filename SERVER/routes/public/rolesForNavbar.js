const express = require('express');
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT role_id, role_name FROM roles WHERE is_system_role = false'
    );
    console.log("result.rows", result.rows)
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching roles for navbar:', err);
    res.status(500).json({ message: 'Failed to fetch roles for navbar' });
  }
});

module.exports = router;
