const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  
  // Check if refresh token exists in the cookies
  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Refresh token missing or invalid.' });
  }

  const refreshToken = cookies.jwt;

  try {
    // Check if the refresh token exists in the database
    const data = await pool.query('SELECT * FROM users WHERE refreshtoken = $1', [refreshToken]);
    const foundUser = data.rows;

    // If no user is found with the refresh token, return a 403 Forbidden status
    if (foundUser.length === 0) {
      return res.status(403).json({ message: 'User not found or refresh token invalid.' });
    }

    // Verify the JWT token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser[0].username !== decoded.username) {
        return res.status(403).json({ message: 'Invalid refresh token or mismatch.' });
      }

      // Ensure roles are safely extracted (if roles are in a JSON object or array)
      const roles = foundUser[0].roles ? Object.values(foundUser[0].roles) : [];

      // Generate a new access token
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": decoded.username,
            "roles": roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' } // Access token expiration time
      );

      // Respond with the new access token and roles
      return res.json({ accessToken, roles });
    });

  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ message: 'Internal server error during token refresh.' });
  }
};

module.exports = { handleRefreshToken };
