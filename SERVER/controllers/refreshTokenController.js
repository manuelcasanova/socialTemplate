const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  try {
    // First, check if the refresh token exists in the database
    const data = await pool.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
    const foundUser = data.rows;

// console.log("data", data.rows)

    if (foundUser.length === 0) {
      return res.sendStatus(403); // Forbidden if no user is found with the refresh token
    }

    // Now verify the refresh token using JWT
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err || foundUser[0].username !== decoded.username) {
        return res.sendStatus(403); // Forbidden if JWT is invalid or user doesn't match
      }


      // console.log("decoded", decoded)
      // Fetch roles associated with the user from the user_roles and roles tables
      const rolesData = await pool.query(
        `SELECT r.role_name FROM roles r
         JOIN user_roles ur ON r.role_id = ur.role_id
         WHERE ur.user_id = $1`, 
        [foundUser[0].user_id]
      );

      // console.log("rolesData", rolesData)

      const roles = rolesData.rows.map(row => row.role_name); // Extract role names

      // console.log("roles", roles)

      // Create the access token with roles included
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": decoded.username,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' } // Long expiration time in production
      );

      res.json({ roles, accessToken });
    });

  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal server error
  }
};

module.exports = { handleRefreshToken };
