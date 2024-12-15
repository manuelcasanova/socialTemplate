const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const handleVerifyEmail = async (req, res) => {
    const { user_id, token } = req.params;

    try {
        const data = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        const user = data.rows[0];

        if (!user) {
            return res.status(404).json({ 'message': 'User not found.' });
        }

        const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ 'message': 'Invalid or expired token.' });
            }

            // If token is valid, set is_verified to true
            await pool.query('UPDATE users SET is_verified = true WHERE user_id = $1', [user_id]);

            // Render the success page with status 'verified'
            res.render('emailVerified', { status: 'verified' });
        });
    } catch (err) {
        console.log(err);
        return res.render('emailVerified', { status: 'failed' });  // Internal error, render failure
    }
};
module.exports = { handleVerifyEmail };
