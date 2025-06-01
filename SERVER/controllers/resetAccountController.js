const pool = require('../config/db');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
const validateEmailConfig = require('../middleware/validateEnv')

const BASE_URL = process.env.REMOTE_CLIENT_APP;

// Function to handle user account restoration
const handleReset = async (req, res) => {
    validateEmailConfig(); 
  const { email } = req.body;  // Expecting the email in the body of the request

  if (!email) {
      return res.status(400).json({ message: 'Email is required to restore the account.' });
  }

  try {
      // Find the user by email, looking for accounts that are inactive (email starting with 'inactive-')
      const findUserQuery = 'SELECT * FROM users WHERE email LIKE $1';
      const result = await pool.query(findUserQuery, [`inactive-%${email}`]); // Match the email with 'inactive-TIMESTAMP-email@example.com'

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'User not found or the account is not in a deleted state.' });
      }

      // Restore the user by updating the `is_active` flag and removing the `inactive-<timestamp>-` prefix
      const user = result.rows[result.rows.length - 1]; //Instead of result.rows[0], the last one, in case the account was deleted multiple times, to get the latest.
      const originalEmail = user.email.replace(/^inactive-\d{13}-/, ''); // Remove the 'inactive-<timestamp>-' part

      const originalUsername = user.username.replace(/^inactive-\d{13}-/, '');

      // Update the user account to restore it
      const restoreUserQuery = `
          UPDATE users 
          SET email = $1,
          username = $2,
          is_active = true 
          WHERE email = $3 
          RETURNING *;
      `;
      const restoredUser = await pool.query(restoreUserQuery, [originalEmail, originalUsername, user.email]);  // Use 'user.email' here as it's the one with the timestamp

      if (restoredUser.rows.length > 0) {
        const restoredUserDetails = restoredUser.rows[0]; //Would be the last one if more than one with the same email

        // Step 2: Generate a verification token for the restored user
        const secret = process.env.ACCESS_TOKEN_SECRET + restoredUserDetails.password;
        const token = jwt.sign(
            { email: restoredUserDetails.email, user_id: restoredUserDetails.user_id },
            secret,
            { expiresIn: '1h' }
        );
        const verificationLink = `${BASE_URL}/verify-email/${restoredUserDetails.user_id}/${token}`;

        // Step 3: Send verification email
        let transporter = nodemailer.createTransport({
            host: process.env.RESET_EMAIL_CLIENT,
            port: process.env.RESET_EMAIL_PORT,
            auth: {
                user: process.env.RESET_EMAIL,
                pass: process.env.RESET_EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.RESET_EMAIL,
            to: originalEmail,
            subject: 'Email Verification - Fullstack Template',
            html: `
            <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: var(--color13, lightblue);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            .email-header {
                background-color: var(--color9, darkblue);
                color: var(--color1, white);
                padding: 20px;
                text-align: center;
                font-size: 24px;
            }
            .email-body {
                padding: 20px;
                background-color: var(--color1, white);
            }
            .email-body p {
                font-size: 16px;
                line-height: 1.5;
                color: #333;
            }
            .verify-link {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 25px;
                font-size: 16px;
                color: var(--color1, white);
                background-color: var(--color9, darkblue);
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s ease;
                text-align: center;
            }
            .verify-link:hover {
                background-color: var(--color13, lightblue);
                color: var(--color9, darkblue);
            }
            .email-body a {
                margin: 5px 0 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                Email Verification - Account Restoration
            </div>
            <div class="email-body">
                <p>
                    Hello,
                </p>
                <p>
                    Your account has been successfully restored! To complete the restoration process, please verify your email address by clicking the button below:
                </p>
                <a href="${verificationLink}" class="verify-link">Verify Email</a>
                <p>
                    If you did not request this, please ignore this email. Your account is safe.
                </p>
                <p>
                    Thank you!
                </p>
            </div>
        </div>
    </body>
</html>

            `
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        // Return success message to the client
        return res.status(200).json({
            success: true,
            message: `Account with email ${email} has been successfully restored. Please check your email for the verification link.`
        });

    }

      // If something goes wrong during the update, return an error
      return res.status(500).json({ message: 'Failed to restore the account. Please try again later.' });

  } catch (err) {
      console.error('Error restoring account:', err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { handleReset };
