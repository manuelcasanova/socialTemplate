const express = require('express');
const { fetchRoles } = require('../../config/fetchRoles');
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

module.exports = router;