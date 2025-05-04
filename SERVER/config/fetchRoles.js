// roles.js
const pool  = require('./db')

const fetchRoles = async () => {
  try {
    const result = await pool.query('SELECT role_name FROM roles');
    const rolesList = result.rows.map(row => row.role_name);
    return rolesList;
  } catch (err) {
    console.error('Error fetching roles:', err);
    return []; 
  }
};

const fetchCustomRoles = async () => {
  try {
    const result = await pool.query('SELECT * FROM roles');
    return result.rows
  } catch (err) {
    console.error('Error fetching custom roles:', err);
    return []; 
  }
};


module.exports = {fetchRoles, fetchCustomRoles};
