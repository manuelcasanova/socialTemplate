const pool = require('../config/db');

const handleLogout = async (req, res) => {
  //On front end, also delete the accessToken


  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204); //Successful. No content to send back
  const refreshToken = cookies.jwt;

  //See if refresh token is in db
  try {
    const data = await pool.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken])
    const foundUser = data.rows;
  if (foundUser.length === 0) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  } else {


//If we reach this point, we found the same refresh token in db
  //Delete the refresh token in db

  foundUser[0].refreshToken = '';
//  console.log("foundUser", foundUser[0])
   pool.query('UPDATE users SET refresh_token=$1 WHERE user_id=$2', [foundUser[0].refreshToken, foundUser[0].user_id])


  //console.log(result); //Delete before production
  
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); //secure: true - only serves on https. We would add this on production
    res.sendStatus(204);


  }
  } catch (error) {
    console.log(error)
  }

  
}

module.exports = { handleLogout }