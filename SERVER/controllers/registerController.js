const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
const { response } = require('express');
const admin = require('../firebaseAdmin');  
const validateEmailConfig = require('../middleware/validateEnv')

const BASE_URL = process.env.REMOTE_CLIENT_APP;

const usernameRegex = /^[A-z][A-z0-9-_]{3,23}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).{8,24}$/;
const emailRegex = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

let forceCreateNew = false;

const handleNewUser = async (req, res) => {
    validateEmailConfig(); 
    let { user, pwd, email, role, restoreAction } = req.body;

    if (!user || !pwd || !email) {
        return res.status(400).json({ 'message': 'Username, email, and password are required.' });
    }

    // Validate username, password, and email using regex
    if (!usernameRegex.test(user)) {
        return res.status(400).json({ 'message': 'Invalid username. It must be 4-24 characters long, start with a letter, and can include letters, numbers, dashes, or underscores.' });
    }

    if (!passwordRegex.test(pwd)) {
        return res.status(400).json({ 'message': 'Invalid password. It must be 8-24 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ 'message': 'Invalid email format.' });
    }

    // Normalize username (capitalize the first letter and lowercase the rest)
    user = user.charAt(0).toUpperCase() + user.slice(1).toLowerCase();

    // Default role if not provided (if the role is user_subscribed, for example)
    const userRole = role || 'user_not_subscribed'; // Default role can be 'user_not_subscribed'

    try {
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);



        // Step 1: Check if the email is already associated with an active user
        const duplicateCheckQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2 AND is_active = true';
        const result = await pool.query(duplicateCheckQuery, [user, email]);

        if (result.rows.length > 0) {
            return res.status(409).json({ 'message': 'User with that username or email already exists.' });
        }


        if (!restoreAction) {
        // Step 2: Check for inactive email (soft-deleted account)
        const checkSoftDeleteQuery = 'SELECT * FROM users WHERE email LIKE $1 AND is_active = false';


        // Check for soft-deleted email, but skip it if 'forceCreateNew' is set to true

            // Query to match emails that are soft deleted (inactive) with a timestamp
            const softDeletedResult = await pool.query(checkSoftDeleteQuery, [`inactive-%${email}`]);

            if (softDeletedResult.rows.length > 0) {
                // Email exists as soft-deleted user
                const userToReactivate = softDeletedResult.rows[0];

                // Optionally: Ask the user if they want to restore the old account
                return res.status(400).json({
                    message: 'An account with this email was previously deleted. Would you like to restore your old account or create a new one?',
                    action: 'restore', // Indicating that the user can restore their old account
                    userId: userToReactivate.user_id
                });
            }
        }

        // Step 3: If no soft-deleted account, proceed with creating a new user
        const insertUserQuery = 'INSERT INTO users (username, email, password, is_verified) VALUES ($1, $2, $3, false) RETURNING user_id';
        const userInsertResult = await pool.query(insertUserQuery, [user, email, hashedPwd]);

        // Get the user_id of the newly inserted user
        const newUserId = userInsertResult.rows[0].user_id;

        // Map the role to corresponding role_id (and add the inherited roles)
        const roleAssignments = getRoleAssignments(userRole);

        // Insert the user-role associations into the 'user_roles' table
        const roleQueries = roleAssignments.map(role_id => {
            return pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [newUserId, role_id]);
        });

        // Wait for all the role assignments to be executed
        await Promise.all(roleQueries);

        // Generate a verification token
        const secret = process.env.ACCESS_TOKEN_SECRET + hashedPwd;
        const token = jwt.sign({ email, user_id: newUserId }, secret, { expiresIn: '1h' });
        const verificationLink = `${BASE_URL}/verify-email/${newUserId}/${token}`;

        // Send verification email
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
            to: email,
            subject: 'Email Verification - Fullstack Template',
            html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                            Email Verification - Fullstack Template
                        </div>
                        <div class="email-body">
                            <p>
                                Hi ${user},
                            </p>
                            <p>
                                Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below.
                            </p>
                            <a href="${verificationLink}" class="verify-link">Verify Email</a>
                            <p>
                                If you did not create an account with us, please ignore this email. Your email is safe.
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
        res.status(201).json({
            success: 'User created successfully. Please check your email for the verification link.'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
};


// Function to return the role_ids for a given role
const getRoleAssignments = (role) => {
    const roleAssignments = {
        user_not_subscribed: [1], // All roles for User 1: inherits everything
        user_subscribed: [1, 2],           // User Subscribed: inherits User_subscribed, Moderator, Admin
        moderator: [1, 2, 3],                    // Moderator: inherits Moderator, User_subscribed
        admin: [1, 2, 3, 4],                        // Admin: inherits Admin, User_subscribed
        superadmin: [1, 2, 3, 4, 5],          // SuperAdmin: inherits all roles
    };

    // Return the role ids based on the given role
    return roleAssignments[role] || [1]; // Default to 'user_not_subscribed' if no match found
};


// New Google Sign-Up Handler
const handleGoogleSignUp = async (req, res) => {
    const { token } = req.body;  // The token will be sent from the frontend
  
    try {
      // Verify the Firebase ID token using Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { email, uid, name } = decodedToken;
  
      // Check if the user already exists (based on email or UID)
      const duplicateCheckQuery = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
      const result = await pool.query(duplicateCheckQuery, [email]);
  
      if (result.rows.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }
  
      // Proceed to create a new user with the decoded token details
      const insertUserQuery = 'INSERT INTO users (username, email, password, is_verified) VALUES ($1, $2, $3, true) RETURNING user_id';
      const userInsertResult = await pool.query(insertUserQuery, [name, email, 'google_auth_token']); // Store 'google_auth_token' as a placeholder password
      const newUserId = userInsertResult.rows[0].user_id;
  
      // Handle user roles and verification (can be skipped or modified as needed)
      const roleAssignments = getRoleAssignments('user_not_subscribed');
      const roleQueries = roleAssignments.map(role_id => {
        return pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [newUserId, role_id]);
      });
  
      await Promise.all(roleQueries);
  
      res.status(201).json({ message: 'Google sign-up successful. User created.' });
  
    } catch (err) {
      console.error('Error verifying Firebase token:', err);
      res.status(500).json({ message: 'Error during Google sign-up.' });
    }
  };


module.exports = { handleNewUser, handleGoogleSignUp };
