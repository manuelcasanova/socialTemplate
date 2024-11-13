const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { pwd, email } = req.body;

//req.body OK: { email: 'admin@example.com', pwd: 'Password1!', trustDevice: true }
// console.log("req.body", req.body)
  
  if (!pwd || !email) {
    return res.status(400).json({ 'message': 'Email and password are required.' });
  }

  try {
    // Query the database to fetch the user along with their role
    const data = await pool.query(`
      SELECT u.user_id, u.username, u.email, u.password, u.role_id, r.role_name 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = $1`, 
      [email]
    );
    
    const foundEmail = data.rows;

//OK!
// console.log("foundEmail", foundEmail)

    if (foundEmail.length === 0) {
      return res.status(400).json({ error: "No user registered" });
    }

    // Verify the password
    bcrypt.compare(pwd, foundEmail[0].password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }

      if (result === true) {
        // Fetch the user's roles
        const roles = foundEmail[0].role_name ? [foundEmail[0].role_name] : []; // Assuming only one role per user

      // OK!
      // console.log("roles", roles)

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
          { expiresIn: '20m' } // In production, a few minutes.
        );

        // OK!
        // console.log("access Token", accessToken)

        // Create a refresh token
        const refreshToken = jwt.sign(
          { "username": foundEmail[0].username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1h' }
        );

        // Save the refresh token in the user's record
        pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [refreshToken, email]);

        // Send the refresh token as a cookie (HTTP only)
        res.cookie('jwt', refreshToken, {
          httpOnly: true, 
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

              // OK!
        // console.log("res.json", {  
        //   userId: foundEmail[0].user_id, 
        //   roles, 
        //   accessToken })

  
        res.json({ 
          userId: foundEmail[0].user_id, 
          roles, 
          accessToken 
        });

      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { handleLogin };
