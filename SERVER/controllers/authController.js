const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { REMOTE_CLIENT_APP, RESET_EMAIL_CLIENT, RESET_EMAIL_PORT, RESET_EMAIL, RESET_EMAIL_PASSWORD, ACCESS_TOKEN_SECRET } = process.env;
const validateEmailConfig = require('../middleware/validateEnv')
const i18next = require('../config/i18n');


const handleLogin = async (req, res) => {
    validateEmailConfig();

    const { pwd, email } = req.body;

    if (!pwd || !email) return res.status(400).json({ 'message': 'Email and password are required.' });


    try {
        const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const foundEmail = data.rows;

        if (foundEmail.length === 0) {
            return res.status(400).json({ error: "Wrong email or password" });
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

                const preferredLanguage = foundEmail[0].language || 'en'; // Default to 'en' if not set
                const socialVisibility = foundEmail[0].social_visibility
                const adminVisibility = foundEmail[0].admin_visibility
                const loginHistoryVisibility = foundEmail[0].login_history_visibility

                // Check if the user has any unread messages (status = 'sent')
                const unreadMessages = await pool.query(
                    'SELECT * FROM user_messages WHERE receiver = $1 AND status = $2',
                    [userId, 'sent']
                );

                const hasNewMessages = unreadMessages.rows.length > 0;

                const postReports = await pool.query(
                    'SELECT 1 FROM post_reports WHERE status = $1 LIMIT 1',
                    ['Reported']
                );

                const hasPostReports = postReports.rows.length > 0;

                const commentsReports = await pool.query(
                    'SELECT 1 FROM post_comments_reports WHERE status = $1 LIMIT 1',
                    ['Reported']
                );

                const hasCommentsReports = commentsReports.rows.length > 0;

                // Insert login history with UTC time (ISO format)
                await pool.query(
                    'INSERT INTO login_history (user_id, login_time) VALUES ($1, $2)',
                    [userId, new Date().toISOString()]
                );


                // Create JWTs
                const accessToken = jwt.sign(
                    { "UserInfo": { "email": foundEmail[0].email, "roles": roles, "preferred_language": preferredLanguage, "social_visibility": socialVisibility, "admin_visibility": adminVisibility, "login_history_visibility": loginHistoryVisibility } },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '5m' } //5m
                );
                const refreshToken = jwt.sign(
                    { "username": foundEmail[0].username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '24h' } //24h
                );

                // Save refreshToken with current user
                await pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [refreshToken, email]);

                // Set the refresh token as a secure HTTP-only cookie
                res.cookie('jwt', refreshToken, {
                    httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000
                });
                // console.log(`Does User ID ${userId} have new messages? ${hasNewMessages}`)
                // Return the response with the access token, user ID, and roles
                res.json({ userId, roles, accessToken, preferredLanguage, hasNewMessages, hasPostReports, hasCommentsReports, socialVisibility, adminVisibility, loginHistoryVisibility});

            } else {
                res.status(401).json({ error: "Wrong email or password" });
            }
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const resendVerificationEmail = async (req, res) => {
    const { email, language } = req.body;
    const t = i18next.getFixedT(language);
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
            from: process.env.RESET_EMAIL,
            to: email,
            subject: t('registerControllerEmail.subject'),
            html: `
            <!DOCTYPE html>
              <html lang="${language}">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

                    <title>${t('registerControllerEmail.subject')}</title>
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
                           ${t('registerControllerEmail.header')}
                        </div>
                        <div class="email-body">
                            <p>
                               ${t('registerControllerEmail.greeting', { user: user.username })}
                            </p>
                            <p>
                                ${t('registerControllerEmail.instruction')}
                            </p>
                            <a href="${verificationLink}" class="verify-link">${t('registerControllerEmail.button')}</a>
                            <p>
                               ${t('registerControllerEmail.disclaimer')}
                            </p>
                            <p>
                                ${t('registerControllerEmail.thanks')}
                            </p>
                        </div>
                    </div>
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

const handleFirebaseLogin = async (req, res) => {
    const { email, displayName, uid } = req.body;

    // Validate input
    if (!email || !uid) {
        return res.status(400).json({ error: 'Invalid Firebase credentials.' });
    }

    try {
        // Check if the user exists in the database
        let data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = data.rows[0];
        
        if (!user) {
            // If user is not found, return the specific error message
            return res.status(404).json({ error: 'User not registered.' });
        }

        const preferredLanguage = user.language || 'en'; // Get preferred language
        const socialVisibility = user.social_visibility;
        const adminVisibility = user.admin_visibility;
        const loginHistoryVisibility = user.login_history_visibility;

        // Generate JWT tokens
        const userId = user.user_id;
        const roleData = await pool.query('SELECT r.role_name FROM roles r JOIN user_roles ur ON ur.role_id = r.role_id WHERE ur.user_id = $1', [userId]);
        const roles = roleData.rows.map(role => role.role_name);

        const accessToken = jwt.sign(
            { "UserInfo": { "email": email, "roles": roles, "preferred_language": preferredLanguage } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' } //5m
        );
        const refreshToken = jwt.sign(
            { "username": user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '24h' } //24h
        );

        // Save refresh token in the database
        await pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [refreshToken, email]);

        const unreadMessages = await pool.query(
            'SELECT * FROM user_messages WHERE receiver = $1 AND status = $2',
            [userId, 'sent']
        );

        const hasNewMessages = unreadMessages.rows.length > 0;

        const postReports = await pool.query(
            'SELECT 1 FROM post_reports WHERE status = $1 LIMIT 1',
            ['Reported']
        );

        const hasPostReports = postReports.rows.length > 0;

        const commentsReports = await pool.query(
            'SELECT 1 FROM post_comments_reports WHERE status = $1 LIMIT 1',
            ['Reported']
        );

        const hasCommentsReports = commentsReports.rows.length > 0;


        // Insert login history with UTC time (ISO format)
        await pool.query(
            'INSERT INTO login_history (user_id, login_time) VALUES ($1, $2)',
            [userId, new Date().toISOString()]
        );



        // Set the refresh token as an HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000
        });

        // Send the response with the generated tokens
        res.json({ userId, roles, accessToken, preferredLanguage, hasNewMessages, hasPostReports, hasCommentsReports, socialVisibility, adminVisibility, loginHistoryVisibility });
    } catch (error) {
        console.error('Error during Firebase login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





module.exports = { handleLogin, resendVerificationEmail, handleFirebaseLogin };
