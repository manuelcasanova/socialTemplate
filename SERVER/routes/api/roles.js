const express = require('express');
const {fetchRoles, fetchCustomRoles} = require('../../config/fetchRoles'); 
const router = express.Router();

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

module.exports = router;