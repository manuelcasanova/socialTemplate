const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
  const { pwd, trimmedEmail } = req.body;
  if (!pwd || !trimmedEmail) return res.status(400).json({ 'message': 'Email and password are required.' });

  console.log("req.body", req.body)

  try {
    const data = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);
    const foundEmail = data.rows;
    if (foundEmail.length === 0) {
      return res.status(400).json({ error: "No user registered" });
    } else {
      bcrypt.compare(pwd, foundEmail[0].password, async (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        } else if (result === true) {
          // Grab the userId and roles
          const userId = foundEmail[0].user_id;
          
          // Get user roles from the user_roles and roles tables
          const roleData = await pool.query(
            'SELECT r.role_name FROM roles r ' +
            'JOIN user_roles ur ON ur.role_id = r.role_id ' +
            'WHERE ur.user_id = $1', [userId]
          );
          
          const roles = roleData.rows.map(role => role.role_name);

          // Create JWTs
          const accessToken = jwt.sign(
            { "UserInfo": { "email": foundEmail[0].email, "roles": roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20m' }
          );
          const refreshToken = jwt.sign(
            { "username": foundEmail[0].username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1h' }
          );

          // Save refreshToken with current user
          await pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [refreshToken, trimmedEmail]);

          // Set the refresh token as a secure HTTP-only cookie
          res.cookie('jwt', refreshToken, {
            httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000
          });

          // Return the response with the access token, user ID, and roles
          res.json({ userId, roles, accessToken });

        } else {
          res.status(401).json({ error: "Enter correct password" });
        }
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { handleLogin };
