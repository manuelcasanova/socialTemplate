const pool = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Function to get all users

const getAllUsers = async (req, res) => {
    try {
        const { username, email, role, is_active, user_id } = req.query;


        // Validate and sanitize user_id (should be a positive integer)
        if (user_id && isNaN(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id format' });
        }

        // Validate is_active (should be 'true' or 'false')
        if (is_active && !['true', 'false'].includes(is_active)) {
            return res.status(400).json({ error: 'Invalid is_active value. Expected "true" or "false".' });
        }

        // Validate and sanitize email (only allow letters, numbers, @, ., -, and _)
        if (email && !/^[a-zA-Z0-9@.\-_]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format. Only letters, numbers, @, ., hyphen, and underscore are allowed.' });
        }


        // Start the base query
        let query = `
            SELECT 
                u.user_id, 
                u.username, 
                u.email, 
                u.is_active, 
                u.is_verified, 
                u.location, 
                COALESCE(array_agg(DISTINCT r.role_name) FILTER (WHERE r.role_name IS NOT NULL), '{}') AS roles,
                COALESCE(array_agg(DISTINCT lh.login_time) FILTER (WHERE lh.login_time IS NOT NULL), '{}') AS login_history
            FROM 
                users u
            LEFT JOIN 
                user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN 
                roles r ON ur.role_id = r.role_id
            LEFT JOIN 
                login_history lh ON u.user_id = lh.user_id
            WHERE
                1=1
        `; // 1=1 is a way to make the WHERE clause always true, so filters can be added conditionally

        const params = [];

        // Add filters to the query based on the req.query parameters
        if (username) {
            query += ` AND u.username ILIKE $${params.length + 1}`;
            params.push(`%${username}%`);  // Use ILIKE for case-insensitive matching
        }
        if (email) {
            query += ` AND u.email ILIKE $${params.length + 1}`;
            params.push(`%${email}%`);
        }
        if (role) {
            query += ` AND r.role_name = $${params.length + 1}`;
            params.push(role);
        }
        if (is_active !== undefined) {
            query += ` AND u.is_active = $${params.length + 1}`;
            params.push(is_active === 'true');  // Convert to boolean
        }
        if (user_id) {
            query += ` AND u.user_id = $${params.length + 1}`;
            params.push(user_id);
        }

        // Add the GROUP BY and execute the query
        query += `
            GROUP BY 
                u.user_id, u.username, u.email, u.is_active, u.is_verified, u.location;
        `;

        const result = await pool.query(query, params);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// const getUserById = async (req, res) => {
//     const { user_id } = req.params; // Extract user_id from request parameters
//     try {
//         const result = await pool.query(
//             'SELECT username, email FROM users WHERE user_id = $1',
//             [user_id]
//         );

//         if (result.rows.length === 0) {
//             // If no user is found, return a 404 status
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json(result.rows[0]); // Respond with the user data
//     } catch (error) {
//         console.error('Error retrieving user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const getUserById = async (req, res) => {
    const { user_id } = req.params; // Extract user_id from request parameters
    try {
        // Query to get user details (username, email)
        const userResult = await pool.query(
            'SELECT username, email FROM users WHERE user_id = $1',
            [user_id]
        );

        if (userResult.rows.length === 0) {
            // If no user is found, return a 404 status
            return res.status(404).json({ error: 'User not found' });
        }

        // Query to get user roles, including whether the user is subscribed
        const rolesResult = await pool.query(
            'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
            [user_id]
        );

        const roles = rolesResult.rows.map(row => row.role_name);

        // Check if the user has the 'user_subscribed' role
        const isSubscribed = roles.includes('user_subscribed');

        // Construct the response
        const user = userResult.rows[0];
        user.roles = roles;
        user.isSubscribed = isSubscribed; // Add subscription status

        // Return the user data along with subscription status
        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Function to update user details
const updateUser = async (req, res) => {
    const { username, email, password, userId } = req.body; // Destructure fields from the request body

    // Validate input fields
    if (!username && !email && !password) {
        return res.status(400).json({ error: 'At least one field (username, email, password) is required to update.' });
    }

    try {
        // Update user details based on which fields are provided
        let query = 'UPDATE users SET ';
        let values = [];
        let setValues = [];

        if (username) {
            setValues.push(`username = $${setValues.length + 1}`);
            values.push(username);
        }
        if (email) {
            setValues.push(`email = $${setValues.length + 1}`);
            values.push(email);
        }
        if (password) {
            // Encrypt the password before updating
            const hashedPassword = await bcrypt.hash(password, 10);
            setValues.push(`password = $${setValues.length + 1}`);
            values.push(hashedPassword);
        }

        query += setValues.join(', ') + ' WHERE user_id = $' + (setValues.length + 1);
        values.push(userId); // Add the user_id for the WHERE clause

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found or no changes made' });
        }

        res.status(200).json({ success: true, message: 'User updated successfully' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to delete user account
const softDeleteUser = async (req, res) => {
    const { userId } = req.params; // Extract user_id from request parameters

    try {
        // Step 1: Fetch the current user's email
        const userResult = await pool.query(
            'SELECT email FROM users WHERE user_id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            // If no user found, return 404
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the current email
        const currentEmail = userResult.rows[0].email;

        const timestamp = Date.now();

        // Create the new email by prepending 'inactive-' to the current email
        const updatedEmail = `inactive-${timestamp}-${currentEmail}`;

        // Step 2: Update the user's status to inactive (set is_active to false)
        // and change the email
        const updateResult = await pool.query(
            'UPDATE users SET is_active = false, is_verified = false, email = $1 WHERE user_id = $2 RETURNING *',
            [updatedEmail, userId]
        );

        if (updateResult.rows.length === 0) {
            // If no rows were updated, return 404
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Delete the user's profile picture file (if it exists)
        const profilePicturePath = path.join(__dirname, '..', 'media', 'profile_pictures', userId, 'profilePicture.jpg');

        if (fs.existsSync(profilePicturePath)) {
            fs.unlink(profilePicturePath, (err) => {
                if (err) {
                    console.error('Error deleting profile picture:', err);
                } else {
                    // console.log('Profile picture deleted successfully');
                }
            });
        }

        // Step 3: Delete the user's folder using fs.rm (to avoid deprecation warning)
        const userFolderPath = path.join(__dirname, '..', 'media', 'profile_pictures', userId);

        // Use fs.rm() instead of fs.rmdir() to handle folder deletion correctly
        fs.rm(userFolderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Error deleting user folder:', err);
            } else {
                // console.log('User folder deleted successfully');
            }
        });

        // Step 4: Send a success response
        res.status(200).json({ success: true, message: 'User successfully deleted, and associated files removed', user: updateResult.rows[0] });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Function to upload a profile picture
const uploadProfilePicture = async (req, res) => {
    const { userId } = req.params;

    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;

    try {
        // Ensure the user folder exists (for storing the profile picture)
        const userFolderPath = path.join(__dirname, '..', 'media', 'profile_pictures', userId);

        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true });
        }

        // Path where the profile picture will be stored
        const profilePicturePath = path.join(userFolderPath, 'profilePicture.jpg');

        // Rename the file and move it to the desired location
        fs.renameSync(file.path, profilePicturePath);


        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            file: profilePicturePath,
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Update roles (done by admin)

const updateRoles = async (req, res) => {
    const userId = parseInt(req.params.user_id); // Extract the user ID from the request parameters
    const { roles, loggedInUser } = req.body;

    try {
        // Step 1: Ensure logged-in user exists in the request body
        if (!loggedInUser) {
            return res.status(400).json({ error: 'Logged-in user ID not provided' });
        }

        // Step 2: Fetch the logged-in user's data from the database
        const loggedInUserResult = await pool.query(
            'SELECT * FROM users WHERE user_id = $1',
            [loggedInUser]
        );

        if (!loggedInUserResult.rows.length) {
            return res.status(404).json({ error: 'Logged-in user not found' });
        }

        const loggedInUserData = loggedInUserResult.rows[0];

        // Step 3: Check if the logged-in user has the required role (Admin or SuperAdmin)
        const loggedInUserRolesResult = await pool.query(
            'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
            [loggedInUser]
        );

        const loggedInUserRoles = loggedInUserRolesResult.rows.map(row => row.role_name);

        if (!loggedInUserRoles.includes('Admin') && !loggedInUserRoles.includes('SuperAdmin')) {
            return res.status(403).json({ error: 'Permission denied: Only Admin or SuperAdmin can update roles' });
        }

        // Step 4: Check if logged-in user is Admin or SuperAdmin
        if (!loggedInUserRoles.includes('Admin') && !loggedInUserRoles.includes('SuperAdmin')) {
            return res.status(403).json({ error: 'Permission denied: Only Admin or SuperAdmin can update roles' });
        }

        // Step 5: Check if logged-in user is an Admin and is trying to modify another Admin
        if (loggedInUserRoles.includes('Admin') && !loggedInUserRoles.includes('SuperAdmin')) {
            const userRolesResult = await pool.query(
                'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
                [userId]
            );
            const userRoles = userRolesResult.rows.map(row => row.role_name);


            // If both loggedInUser and the user being modified are Admins, prevent the modification
            if (userRoles.includes('Admin') && loggedInUser !== userId) {
                return res.status(403).json({
                    error: 'Admins cannot modify other Admins\' roles'
                });
            }
        }


        // Step 6: Fetch all roles from the roles table to validate the role names
        const availableRolesResult = await pool.query('SELECT * FROM roles');
        const availableRoles = availableRolesResult.rows.map(role => role.role_name); // Get all role names

        // Step 7: Validate the roles provided by the admin
        const invalidRoles = roles.filter(role => !availableRoles.includes(role));
        if (invalidRoles.length > 0) {
            return res.status(400).json({ error: `Invalid roles: ${invalidRoles.join(', ')}` });
        }

        // Step 8: Prevent Admins from assigning "SuperAdmin"
        if (roles.includes('SuperAdmin')) {
            if (!loggedInUserRoles.includes('SuperAdmin')) {
                return res.status(403).json({ error: 'Only SuperAdmin can assign SuperAdmin role' });
            }
        }


        // Step 9: Prevent Admins from assigning "Admin" role to others (but allow self-modification)
        if (roles.includes('Admin')) {
            // Allow the logged-in user to modify their own roles
            if (loggedInUser !== userId) {
                if (!loggedInUserRoles.includes('SuperAdmin')) {
                    return res.status(403).json({ error: 'Only SuperAdmin can assign Admin role to others' });
                }
            }
        }


        // Step 10: Prevent Admins from revoking "SuperAdmin" role
        const userCurrentRolesResult = await pool.query(
            'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
            [userId]
        );
        const userCurrentRoles = userCurrentRolesResult.rows.map(row => row.role_name);

        if (userCurrentRoles.includes('SuperAdmin') && !roles.includes('SuperAdmin')) {
            // Check who assigned the "SuperAdmin" role to prevent revocation by anyone else
            const assignedByResult = await pool.query(
                `SELECT assigned_by_user_id
        FROM user_roles
        INNER JOIN roles ON user_roles.role_id = roles.role_id
        WHERE user_roles.user_id = $1 AND roles.role_name = 'SuperAdmin'`,
                [userId]
            );

            const assignedByUser = assignedByResult.rows[0]?.assigned_by_user_id;

            // 1. Prevent self-revocation (SuperAdmin cannot revoke their own SuperAdmin role)
            if (loggedInUser === userId) {
                return res.status(403).json({ error: 'You cannot revoke your own SuperAdmin role' });
            }

            // 2. Prevent revocation by someone who did not assign the SuperAdmin role
            if (assignedByUser !== loggedInUser) {
                return res.status(403).json({ error: 'Only the user who granted the SuperAdmin role can revoke it' });
            }
        }

        // Step 11: Determine which roles need to be added and removed
        const rolesToAdd = roles.filter(role => !userCurrentRoles.includes(role)); // Roles that are being added
        const rolesToRemove = userCurrentRoles.filter(role => !roles.includes(role)); // Roles that are being removed


        // Step 12: Prevent Admins from revoking their own Admin role
        if (loggedInUserRoles.includes('Admin')) {
            // Check if we are attempting to revoke (not add) the Admin role
            if (userCurrentRoles.includes('Admin') && !roles.includes('Admin')) {
                // Prevent the logged-in user from revoking their own Admin role
                if (loggedInUser === userId) {
                    return res.status(403).json({ error: 'You cannot revoke your own Admin role' });
                }

                // Check if the logged-in Admin user was the one who granted the Admin role
                const adminAssignedByResult = await pool.query(
                    `SELECT assigned_by_user_id
                FROM user_roles
                INNER JOIN roles ON user_roles.role_id = roles.role_id
                WHERE user_roles.user_id = $1 AND roles.role_name = 'Admin'`,
                    [userId]
                );

                const adminAssignedByUser = adminAssignedByResult.rows[0]?.assigned_by_user_id;

            }
        }

        // Allow SuperAdmins to revoke Admin roles freely
        if (loggedInUserRoles.includes('SuperAdmin')) {
            // No restriction for SuperAdmins revoking Admin roles
            // If logged-in user is a SuperAdmin, allow them to revoke the Admin role freely
            const adminAssignedByResult = await pool.query(
                `SELECT assigned_by_user_id
            FROM user_roles
            INNER JOIN roles ON user_roles.role_id = roles.role_id
            WHERE user_roles.user_id = $1 AND roles.role_name = 'Admin'`,
                [userId]
            );

            // No need to check if they assigned it, since SuperAdmins can revoke Admin roles freely
        }




        // Step 13: Remove existing roles from the user
        await pool.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);

        // Step 14: Assign new roles to the user, including the tracking of who assigned the role
        const rolePromises = roles.map(role => {
            return pool.query(
                'INSERT INTO user_roles (user_id, role_id, assigned_by_user_id) SELECT $1, role_id, $2 FROM roles WHERE role_name = $3',
                [userId, loggedInUser, role]
            );
        });
        await Promise.all(rolePromises); // Execute all role insertions

        // Step 15: Log role changes in role_change_logs
        const roleChangeLogsPromises = [];  // Initialize the array to hold log promises

        // Log roles that were added (assigned)
        rolesToAdd.forEach(role => {
            roleChangeLogsPromises.push(
                pool.query(
                    'INSERT INTO role_change_logs (user_that_modified, user_modified, role, action_type) VALUES ($1, $2, $3, $4)',
                    [loggedInUser, userId, role, 'assigned'] // Add 'assigned' as the action type
                )
            );
        });

        // Log roles that were removed (unassigned)
        rolesToRemove.forEach(role => {
            roleChangeLogsPromises.push(
                pool.query(
                    'INSERT INTO role_change_logs (user_that_modified, user_modified, role, action_type) VALUES ($1, $2, $3, $4)',
                    [loggedInUser, userId, role, 'unassigned'] // Add 'unassigned' as the action type
                )
            );
        });

        // Step 16: Update the subscription status if the "User_subscribed" role is removed
        if (rolesToRemove.includes('User_subscribed')) {
            await pool.query(
                'UPDATE subscriptions SET is_active = false WHERE user_id = $1',
                [userId]
            );
        }

        // Step 17: Update the subscription status if the "User_subscribed" role is removed
        if (rolesToAdd.includes('User_subscribed')) {
            await pool.query(
                'UPDATE subscriptions SET is_active = true WHERE user_id = $1',
                [userId]
            );
        }

        // Execute all log insertions
        await Promise.all(roleChangeLogsPromises);  // Wait for all logs to be inserted


        res.status(200).json({ message: 'Roles updated successfully' });
    } catch (error) {
        console.error('Error updating roles:', error);
        res.status(500).json({ error: 'Failed to update roles' });
    }
};

//Get subscription status

const getSubscriptionStatus = async (req, res) => {
    const userId = req.params.user_id;

    const today = new Date();

    try {
        const result = await pool.query(
            'SELECT is_active, renewal_due_date FROM subscriptions WHERE user_id = $1',
            [userId]
        );


        if (result.rows.length === 0) {
            // console.log("Subscription not found");
            return res.status(200).json(false);
        }

        if (result.rows.length > 0) {
            const renewalDueDate = result.rows[0].renewal_due_date

            // console.log("today", today)
            // console.log("renewal due date", renewalDueDate)
            // console.log("true or false", today < renewalDueDate)


            if (today < renewalDueDate) {
                // console.log("today is before renewal Due Date")
                return res.status(200).json(true);
            } else {
                // console.log("today is after renewal Due Date. Subscription expired")
                return res.status(200).json(false);
            }
        }


    } catch (error) {
        console.error('Error fetching subscription status:', error);
        res.status(500).json({ error: 'Error fetching subscription status' });
    }
}

//Subscribe user after payment confirmation
// Subscribe user after payment confirmation
const subscribeUser = async (req, res) => {
    const { userId, paymentDetails } = req.body;

    try {
        // Step 1: Validate the payment
        const paymentSuccess = await processPayment(paymentDetails);
        if (!paymentSuccess) {
            return res.status(400).json({ error: 'Payment validation failed' });
        }

        // Step 2: Fetch user and subscription details
        const userResult = await pool.query(
            `SELECT u.user_id, 
                    (SELECT COUNT(*) > 0 FROM user_roles ur 
                     INNER JOIN roles r ON ur.role_id = r.role_id 
                     WHERE ur.user_id = u.user_id AND r.role_name = 'User_subscribed') AS has_role,
                    (SELECT is_active AND renewal_due_date > CURRENT_DATE 
                    FROM subscriptions s 
                     WHERE s.user_id = u.user_id 
                     ORDER BY s.start_date DESC LIMIT 1) AS subscription_active
             FROM users u WHERE u.user_id = $1`,
            [userId]
        );

        if (!userResult.rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        // console.log("userResultrows0", userResult.rows[0])

        const { has_role, subscription_active } = userResult.rows[0];

        // Check if the user already has an active subscription
        if (has_role && subscription_active) {
            return res.status(400).json({ error: 'User is already subscribed and has an active subscription' });
        }

        // Step 3: Assign "User_subscribed" role if not already assigned
        if (!has_role) {
            await pool.query(
                `INSERT INTO user_roles (user_id, role_id, assigned_by_user_id) 
                 SELECT $1, role_id, $2 
                 FROM roles WHERE role_name = $3`,
                [userId, userId, 'User_subscribed']
            );

            // Log role assignment
            await pool.query(
                `INSERT INTO role_change_logs (user_that_modified, user_modified, role, action_type) 
                 VALUES ($1, $2, $3, $4)`,
                [userId, userId, 'User_subscribed', 'assigned']
            );
        }

        // Step 4: Add or update subscription details
        const renewalDueDate = new Date();
        renewalDueDate.setFullYear(renewalDueDate.getFullYear() + 1); // Add 1 year
        renewalDueDate.setDate(renewalDueDate.getDate() + 7); // Add 7 days

        if (subscription_active !== null) {
            // Update existing subscription
            await pool.query(
                `UPDATE subscriptions 
                 SET start_date = $4, renewal_due_date = $1, is_active = true, created_by_user_id = $2 
                 WHERE user_id = $3`,
                [renewalDueDate, userId, userId, new Date()]
            );
        } else {
            // Add a new subscription
            await pool.query(
                `INSERT INTO subscriptions (user_id, renewal_due_date, created_by_user_id, is_active) 
                 VALUES ($1, $2, $3, $4)`,
                [userId, renewalDueDate, userId, true]
            );
        }

        return res.status(200).json({ message: 'Subscription successfully updated' });
    } catch (error) {
        console.error('Error during subscription:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


//Fake processPayment function, always succeeds
const processPayment = async ({ amount, currency }) => {
    try {
        // Simulate some logic for processing the payment
        // console.log(`Processing payment of ${amount} ${currency}...`);

        // Fake success: In a real scenario, this would interact with a payment gateway
        if (amount <= 0 || !currency) {
            throw new Error('Invalid payment details');
        }

        // Simulate a delay to mimic real payment processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        // console.log(`Payment of ${amount} ${currency} processed successfully!`);

        return true;
    } catch (error) {
        console.error('Error during payment processing:', error);
        return false;
    }
};




module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    softDeleteUser,
    uploadProfilePicture,
    updateRoles,
    subscribeUser,
    getSubscriptionStatus
};
