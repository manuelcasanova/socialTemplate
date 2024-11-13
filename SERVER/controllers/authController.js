const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { pwd, email } = req.body;

  // Check if both email and password are provided
  if (!pwd || !email) {
    return res.status(400).json({ 'message': 'Email and password are required.' });
  }

  try {
    // Query the database to fetch the user based on email
    const data = await pool.query(`
      SELECT u.user_id, u.username, u.email, u.password 
      FROM users u
      WHERE u.email = $1`, 
      [email]
    );
    
    const foundEmail = data.rows;

    if (foundEmail.length === 0) {
      return res.status(400).json({ error: "No user registered" });
    }

    // Verify the password
    const result = await bcrypt.compare(pwd, foundEmail[0].password);
    
    if (result === true) {
      // Fetch the user's roles via the user_roles table
      const rolesResult = await pool.query(`
        SELECT r.role_name 
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.role_id
        WHERE ur.user_id = $1`, 
        [foundEmail[0].user_id]
      );

      const roles = rolesResult.rows.map(role => role.role_name);

      // Create JWT access token
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "email": foundEmail[0].email,
            "roles": roles,
            "userId": foundEmail[0].user_id
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' } // In production, a few minutes
      );

      // Create a refresh token
      const refreshToken = jwt.sign(
        { "username": foundEmail[0].username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      // Save the refresh token in the user's record
      await pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [refreshToken, email]);

      // Insert login history record
      const insertHistoryQuery = 'INSERT INTO login_history (user_id, login_time) VALUES ($1, CURRENT_TIMESTAMP AT TIME ZONE \'UTC\')';

      await pool.query(insertHistoryQuery, [foundEmail[0].user_id]);

      // Send the refresh token as a cookie (HTTP only)
      res.cookie('jwt', refreshToken, {
        httpOnly: true, 
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      // Send back user data and access token
      res.json({ 
        userId: foundEmail[0].user_id, 
        roles, 
        accessToken 
      });

    } else {
      return res.status(401).json({ error: "Incorrect password" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { handleLogin };
