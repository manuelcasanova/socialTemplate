const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { REMOTE_CLIENT_APP, RESET_EMAIL_CLIENT, RESET_EMAIL_PORT, RESET_EMAIL, RESET_EMAIL_PASSWORD, ACCESS_TOKEN_SECRET } = process.env;


const handleLogin = async (req, res) => {
  const { pwd, email } = req.body;

  if (!pwd || !email) return res.status(400).json({ 'message': 'Email and password are required.' });


  try {
    const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const foundEmail = data.rows;


    if (foundEmail.length === 0) {
      return res.status(400).json({ error: "No user registered" });
    }

    // Check if the user is verified
    if (!foundEmail[0].is_verified) {
      return res.status(401).json({ error: "Please verify your email before logging in. Check your spam folder" });
    }


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


        // Insert login history with UTC time (ISO format)
        await pool.query(
          'INSERT INTO login_history (user_id, login_time) VALUES ($1, $2)',
          [userId, new Date().toISOString()]  // Should store UTC time
        );


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
        await pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [refreshToken, email]);

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


  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    console.log("Resend verification email request for:", email);

    const client = await pool.connect();  // Get a client from the pool

    try {
        // Query the database to find the user
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'User not found or email mismatch' });
        }

        // Check if the user is already verified (optional)
        if (user.is_verified) {
            return res.status(400).json({ error: 'User already verified' });
        }

        // Generate the verification token
        const secret = ACCESS_TOKEN_SECRET + user.password;  // Use a secure secret, possibly hashed password
        const token = jwt.sign({ email, userId: user.user_id }, secret, { expiresIn: '1h' });

        const verificationLink = `${REMOTE_CLIENT_APP}/verify-email/${user.user_id}/${token}`;

        // Create email transporter
        let transporter = nodemailer.createTransport({
            host: RESET_EMAIL_CLIENT,
            port: RESET_EMAIL_PORT,
            auth: {
                user: RESET_EMAIL,
                pass: RESET_EMAIL_PASSWORD
            }
        });

        // Email content
        let mailOptions = {
            from: RESET_EMAIL,
            to: email,
            subject: 'Email Verification',
            html: `
                <html lang="en">
                    <body>
                        <h3>Welcome to our platform, ${user.username}!</h3>
                        <p>Thank you for registering. Please click the button below to confirm your email address:</p>
                        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; border-radius: 4px;">Verify Email</a>
                    </body>
                </html>
            `
        };

        // Send the email
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        // Send success response
        res.status(200).json({ message: 'Verification email resent successfully!' });
    } catch (err) {
        console.error('Error while resending verification email:', err);
        res.status(500).json({ error: 'Failed to resend verification email' });
    } finally {
        client.release();  // Release the client back to the pool
    }
};


module.exports = { handleLogin, resendVerificationEmail };
