const pool = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const validateEmailConfig = require('../middleware/validateEnv')
const i18next = require('../config/i18n');

const usernameRegex = /^[A-z][A-z0-9-_ ]{3,23}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).{8,24}$/;
const emailRegex = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const translations = require('../../CLIENT/public/locales/es/translation.json')

const getAllUsers = async (req, res) => {
    try {
        const { username, email, role, user_id } = req.query;
        let { is_active } = req.query;

        // console.log("req.query", req.query)

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
                u.admin_visibility,
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
            if (is_active === 'true') {
                query += ` AND u.is_active = $${params.length + 1}`;
                params.push(true);
            } else if (is_active === 'false') {
                query += ` AND u.is_active = $${params.length + 1}`;
                params.push(false);
            } else {
                // Treat undefined as NULL to fetch both active and inactive users
                query += ` AND u.is_active IS NULL`;
            }
        }
        if (user_id) {
            query += ` AND u.user_id = $${params.length + 1}`;
            params.push(user_id);
        }

        // Add the GROUP BY and execute the query
        query += `
            GROUP BY 
                u.user_id, u.username, u.email, u.is_active, u.is_verified, u.location, u.admin_visibility;
        `;

        const result = await pool.query(query, params);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Function to get user by id

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId (should be a positive integer)
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // Query to get username and email
        const userQuery = 'SELECT user_id, username, email, social_visibility FROM users WHERE user_id = $1';
        const userParams = [userId];
        const userResult = await pool.query(userQuery, userParams);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { username, email, user_id, social_visibility } = userResult.rows[0];

        // Query to get roles
        const rolesQuery = `
            SELECT r.role_id, r.role_name
            FROM roles r
            INNER JOIN user_roles ur ON ur.role_id = r.role_id
            WHERE ur.user_id = $1
        `;
        const rolesResult = await pool.query(rolesQuery, [userId]);

        const roles = rolesResult.rows.map(row => ({
            role_id: row.role_id,
            role_name: row.role_name
        }));

        res.status(200).json({ username, email, roles, user_id, social_visibility });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// const getUserById = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Validate userId (should be a positive integer)
//         if (userId && isNaN(userId)) {
//             return res.status(400).json({ error: 'Invalid userId format' });
//         }

//         // Build the query to select only the username for the given userId
//         const query = 'SELECT username, email FROM users WHERE user_id = $1';
//         const params = [userId];

//         const result = await pool.query(query, params);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const { username, email } = result.rows[0];
//         res.status(200).json({ username, email });
//     } catch (error) {
//         console.error('Error retrieving user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };



// Function to update user details
const updateUser = async (req, res) => {
    validateEmailConfig();
    let { username, email, password, userId } = req.body; // Destructure fields from the request body

    //Remove for production of a real application. Keep for testing.
    if (userId === 2) {
        return res.status(400).json({ error: 'For test purposes, this account cannot be modified.' });
    }

    // Validate input fields
    if (!username && !email && !password) {
        return res.status(400).json({ error: 'At least one field (username, email, password) is required to update.' });
    }

    if (username) {

        // Capitalize each word in the username
        username = username
            .split(' ') // Split the string by spaces
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
            .join(' '); // Join the words back together with spaces

        if (!usernameRegex.test(username)) {
            return res.status(400).json({ 'message': 'Invalid username. It must be 4-24 characters long, start with a letter, and can include letters, numbers, dashes, or underscores.' });
        }


        const checkUsernameQuery = 'SELECT * FROM users WHERE username = $1';
        const checkUsernameResult = await pool.query(checkUsernameQuery, [username]);

        // If the username exists and is not for the current user (i.e., userId), return an error
        if (checkUsernameResult.rowCount > 0 && checkUsernameResult.rows[0].user_id !== userId) {
            return res.status(400).json({ 'message': 'Username already exists.' });
        }
    }

    if (password) {
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 'message': 'Invalid password. It must be 8-24 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.' });
        }
    }


    if (email) {



        if (!emailRegex.test(email)) {
            return res.status(400).json({ 'message': 'Invalid email format.' });
        }

        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const checkEmailResult = await pool.query(checkEmailQuery, [email]);

        // If the email exists and is not for the current user (i.e., userId), return an error
        if (checkEmailResult.rowCount > 0 && checkEmailResult.rows[0].user_id !== userId) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
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

            setValues.push(`is_verified = $${setValues.length + 1}`);
            values.push(false);
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

        if (userId === 2) {
            return res.status(400).json({ error: 'This account cannot be deleted, as it ensures at least one SuperAdmin remains.' });
        }

        // Step 0: Check if the user is SuperAdmin, to reassign control over other SuperAdmins or Admins to another SuperAdmin.

        // Check if the user is SuperAdmin
        const superAdminCheck = await pool.query(
            'SELECT assigned_by_user_id FROM user_roles WHERE user_id = $1 AND role_id = 1',
            [userId]
        );

        if (superAdminCheck.rows.length > 0) {
            const originalAssignerId = superAdminCheck.rows[0].assigned_by_user_id;

            // Transfer ownership of any roles assigned by this SuperAdmin (SuperAdmin or Admin)
            const assignedUsers = await pool.query(
                `SELECT ur.user_id, ur.role_id, r.role_name
                 FROM user_roles ur
                 JOIN roles r ON ur.role_id = r.role_id
                 WHERE ur.assigned_by_user_id = $1 AND ur.role_id IN (1,2)`,
                [userId]
            );

            for (const row of assignedUsers.rows) {
                await pool.query(
                    'UPDATE user_roles SET assigned_by_user_id = $1 WHERE user_id = $2 AND role_id = $3',
                    [originalAssignerId, row.user_id, row.role_id]
                );

                await pool.query(
                    `INSERT INTO role_change_logs (user_that_modified, user_modified, role, timestamp, action_type)
                     VALUES ($1, $2, $3, NOW(), 'transferred')`,
                    [originalAssignerId, row.user_id, row.role_name]
                );
            }
        }

        // Step 1: Fetch the current user's email, username
        const userResult = await pool.query(
            'SELECT email, username FROM users WHERE user_id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            // If no user found, return 404
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the current email, username
        const currentEmail = userResult.rows[0].email;
        const currentUsername = userResult.rows[0].username;

        const timestamp = Date.now();

        // Create the new email, username by prepending 'inactive-' to the current email, username
        const updatedEmail = `inactive-${timestamp}-${currentEmail}`;

        const updatedUsername = `inactive-${timestamp}-${currentUsername}`;

        // Step 2: Update the user's status to inactive (set is_active to false)
        // and change the email
        const updateResult = await pool.query(
            'UPDATE users SET is_active = false, is_verified = false, email = $1, username = $2 WHERE user_id = $3 RETURNING *',
            [updatedEmail, updatedUsername, userId]
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


//If using this function, the user is removed from the database. It will affect logs, role assignation, etc. So it is not recommended. We suggest using the adminVersionSoftDeleteUser function below.
const hardDeleteUser = async (req, res) => {
    try {
        const { userId } = req.params; // Get user ID from the URL parameter
        const { loggedInUser } = req.body; // Get logged-in user's ID from the body

        // Check if the user exists
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userToDeleteRoles = await pool.query(
            'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
            [Number(userId)]
        );

        const userToDeleteRoleNames = userToDeleteRoles.rows.map(row => row.role_name);

        //Check if the logged-in user has the required role (Admin or SuperAdmin)

        const userCurrentRolesResult = await pool.query(
            'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
            [loggedInUser]
        );

        const userCurrentRoles = userCurrentRolesResult.rows.map(row => row.role_name);

        // console.log("userCurrentRoles", userCurrentRoles)

        if (
            !userCurrentRoles.includes('Admin') &&
            !userCurrentRoles.includes('SuperAdmin')) {
            return res.status(403).json({ error: 'Permission denied: Only Admin or SuperAdmin can hard delete a user' });
        }

        // Permission denied if Deleter and Deletee are the same user.
        if (Number(userId) === loggedInUser) {
            return res.status(403)
                .json({ error: 'Permission denied: You cannot delete your own account here. Do it from "My account"' });
        }

        // Permission denied if Deleter is not a SuperAdmin and Deletee is a Superadmin.
        if (userToDeleteRoleNames.includes('SuperAdmin') && !userCurrentRoles.includes('SuperAdmin')) {
            return res.status(403).json({ error: 'Permission denied: Only a SuperAdmin can delete a SuperAdmin.' });
        }

        // Permission denied if Deleter is a Superadmin and Deletee is also a Superadmin, unless the Deleter granted Superadmin status to the Deletee.
        // Fetch who assigned the SuperAdmin role
        const assignedByResult = await pool.query(
            `SELECT assigned_by_user_id
                 FROM user_roles
                 INNER JOIN roles ON user_roles.role_id = roles.role_id
                 WHERE user_roles.user_id = $1 AND roles.role_name = 'SuperAdmin'`,
            [userId]
        );

        const assignedByUser = assignedByResult.rows[0]?.assigned_by_user_id;


        // Allow only the user who assigned the SuperAdmin role to delete the account of another SuperAdmin.
        if (userToDeleteRoleNames.includes('SuperAdmin') && userCurrentRoles.includes('SuperAdmin')) {
            if (assignedByUser !== loggedInUser
            ) {
                return res.status(403).json({ error: 'SuperAdmins can only delete other Superadmin account if they assigned the SuperAdmin role to that user.' });
            }

            // Perform the hard delete (delete user from the database)
            await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);

            // console.log(`User with ID ${userId} successfully hard deleted.`);

            // Send a success response
            res.status(200).json({ message: `User ${userId} successfully hard deleted.` });
        }

    } catch (error) {
        console.error('Error during user hard deletion:', error);
        res.status(500).json({ error: 'An error occurred while attempting to delete the user.' });
    }
}

const adminVersionSoftDeleteUser = async (req, res) => {
    const { userId } = req.params; // Extract user_id from request parameters
    const requestingUserId = req.body.loggedInUser
    const language = req.body.language
    const t = i18next.getFixedT(language);

    // console.log('t', t)

    // console.log('language', language)

    // console.log('t type of should be function', typeof t); // should be 'function'

    // console.log(t('usersController.cannotDeleteHere'));

    // console.log(t('home.welcome'));

    try {

        // Prevent users from deleting their own account
        if (userId == requestingUserId) {
            return res.status(400).json({ error: t('usersController.cannotDeleteHere') });
        }



        if (userId == 2) {
            // console.log("case")
            return res.status(400).json({ error: t('usersController.accountCannotBeModified') });
        }

        // Step 0: Check if the user to be deleted is a SuperAdmin
        const superAdminCheck = await pool.query(
            'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = 1',
            [userId]
        );

        if (superAdminCheck.rows.length > 0) {
            const assignedBy = superAdminCheck.rows[0].assigned_by_user_id;

            if (parseInt(assignedBy) !== parseInt(requestingUserId)) {
                return res.status(403).json({ error: t('usersController.cannotDeleteThisSuperadmin') });
            }

            // Transfer ownership of any role assignments made by this SuperAdmin (for SuperAdmin or Admin roles)
            const assignedUsers = await pool.query(
                `SELECT ur.user_id, ur.role_id, r.role_name
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.role_id
         WHERE ur.assigned_by_user_id = $1 AND ur.role_id IN (1, 2)`,
                [userId]
            );

            for (const row of assignedUsers.rows) {
                await pool.query(
                    'UPDATE user_roles SET assigned_by_user_id = $1 WHERE user_id = $2 AND role_id = $3',
                    [requestingUserId, row.user_id, row.role_id]
                );

                await pool.query(
                    `INSERT INTO role_change_logs (user_that_modified, user_modified, role, timestamp, action_type)
             VALUES ($1, $2, $3, NOW(), 'transferred')`,
                    [requestingUserId, row.user_id, row.role_name]
                );
            }
        }


        // Step 1: Fetch the current user's email, username
        const userResult = await pool.query(
            'SELECT email, username FROM users WHERE user_id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            // If no user found, return 404
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the current email, username
        const currentEmail = userResult.rows[0].email;

        const timestamp = Date.now();

        // Create the new email
        // Extract the email components
        const [localPart, domain] = currentEmail.split('@');

        // Check if the email starts with 'inactive-' and handle it
        const emailPrefix = localPart;
        const cleanLocalPart = emailPrefix.replace(/^inactive-\d+-/, ''); // Remove 'inactive-<timestamp>-'
        const firstLetter = cleanLocalPart[0];
        const lastLetter = cleanLocalPart[cleanLocalPart.length - 1];
        const maskedLocalPart = firstLetter + '*'.repeat(cleanLocalPart.length - 2) + lastLetter;

        // Construct the updated email
        const updatedEmail = `deleted-${timestamp}-${maskedLocalPart}@${domain}`;


        const updatedUsername = `Deleted User`;

        // Step 2: Update the user's status to inactive (set is_active to false)
        // and change the email
        const updateResult = await pool.query(
            'UPDATE users SET is_active = false, is_verified = false, email = $1, username = $2 WHERE user_id = $3 RETURNING *',
            [updatedEmail, updatedUsername, userId]
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


//This function will be used in constRoles, below, to transfer the assigned_by_user_id when a user's superadmin/admin is revoked.

const transferAssignedRoles = async (demotedUserId, revokerUserId, client = pool) => {
    try {
        // 1. Fetch all affected role assignments
        const { rows: assignedRoles } = await client.query(
            `SELECT user_id, roles.role_name
             FROM user_roles
             INNER JOIN roles ON user_roles.role_id = roles.role_id
             WHERE user_roles.assigned_by_user_id = $1
               AND roles.role_name IN ('SuperAdmin', 'Admin')`,
            [demotedUserId]
        );

        // 2. Update the assigned_by_user_id to the new owner
        await client.query(
            `UPDATE user_roles
             SET assigned_by_user_id = $1
             FROM roles
             WHERE roles.role_id = user_roles.role_id
               AND roles.role_name IN ('SuperAdmin', 'Admin')
               AND user_roles.assigned_by_user_id = $2`,
            [revokerUserId, demotedUserId]
        );

        // 3. Insert logs for accountability
        const logPromises = assignedRoles.map(({ user_id, role_name }) => {
            return client.query(
                `INSERT INTO role_change_logs (user_that_modified, user_modified, role, action_type)
                 VALUES ($1, $2, $3, $4)`,
                [revokerUserId, user_id, role_name, 'transferred']
            );
        });

        await Promise.all(logPromises);
    } catch (err) {
        console.error('Error transferring assigned role ownership:', err);
        throw new Error('Failed to transfer role ownership');
    }
};




//Update roles (done by admin or superadmin)

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

        // Step 3: Check if the logged-in user has the required role (Admin or SuperAdmin)
        const loggedInUserRolesResult = await pool.query(
            'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
            [loggedInUser]
        );

        // Step 4: Get the users current roles 

        const userCurrentRolesResult = await pool.query(
            'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
            [userId]
        );
        const userCurrentRoles = userCurrentRolesResult.rows.map(row => row.role_name);



        // Step 5: Determine which roles need to be added and removed
        const rolesToAdd = roles.filter(role => !userCurrentRoles.includes(role));
        const rolesToRemove = userCurrentRoles.filter(role => !roles.includes(role));

        const loggedInUserRoles = loggedInUserRolesResult.rows.map(row => row.role_name);

        // Step 5.5: Get current role IDs for the user
        const userCurrentRoleIdsResult = await pool.query(
            'SELECT role_id FROM user_roles WHERE user_id = $1',
            [userId]
        );
        const userCurrentRoleIds = userCurrentRoleIdsResult.rows.map(row => row.role_id);

        // Define the protected role ID
        const PROTECTED_ROLE_ID = 5; // User_registered

        // Check if the protected role is currently assigned
        const hasProtectedRole = userCurrentRoleIds.includes(PROTECTED_ROLE_ID);

        // Check if protected role is being removed
        const rolesToRemoveIdsResult = await pool.query(
            `SELECT role_id FROM roles WHERE role_name = ANY($1::text[])`,
            [rolesToRemove]
        );
        const rolesToRemoveIds = rolesToRemoveIdsResult.rows.map(row => row.role_id);

        if (hasProtectedRole && rolesToRemoveIds.includes(PROTECTED_ROLE_ID)) {
            return res.status(403).json({
                error: 'You cannot revoke the User_registered role as it would disable user access. To disable a user, please delete their account instead.'
            });
        }


        // Step 6: Prevent non admins/superadmins modifying roles


        if (!loggedInUserRoles.includes('Admin') && !loggedInUserRoles.includes('SuperAdmin')) {
            return res.status(403).json({ error: 'Permission denied: Only Admin or SuperAdmin can update roles' });
        }

        // Step 7: Check if logged-in user is an Admin and is trying to modify another Admin
        if (loggedInUserRoles.includes('Admin') && !loggedInUserRoles.includes('SuperAdmin')) {
            const userRolesResult = await pool.query(
                'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1',
                [userId]
            );
            const userRoles = userRolesResult.rows.map(row => row.role_name);


            // If both loggedInUser and the user being modified are Admins, prevent the modification
            if (userRoles.includes('Admin') && loggedInUser !== userId) {
                return res.status(403).json({ error: t('usersController.cannotModifyOtherAdmins') });
            }
        }


        // Step 8: Fetch all roles from the roles table to validate the role names
        const availableRolesResult = await pool.query('SELECT * FROM roles');
        const availableRoles = availableRolesResult.rows.map(role => role.role_name); // Get all role names

        // Step 9: Validate the roles provided by the admin
        const invalidRoles = roles.filter(role => !availableRoles.includes(role));
        if (invalidRoles.length > 0) {
            return res.status(400).json({
                error:
                    `Invalid roles: ${invalidRoles.join(', ')}`
            });
        }


        // Step 10: Prevent Admins from assigning "SuperAdmin"
        if (roles.includes('SuperAdmin')) {
            if (!loggedInUserRoles.includes('SuperAdmin')) {
                return res.status(403).json({ error: 'Only SuperAdmin can assign SuperAdmin role' });
            }
        }


        // Step 11: Prevent Admins from assigning "Admin" role to others (but allow self-modification of roles, except admin)
        if (roles.includes('Admin')) {
            // Allow the logged-in user to modify their own roles
            if (loggedInUser !== userId) {
                if (!loggedInUserRoles.includes('SuperAdmin')) {
                    return res.status(403).json({ error: 'Only SuperAdmin can assign Admin role to others' });
                }
            }
        }


        // Step 12: Superadmins can assign or revoke superadmin only to users's they assigned the role in the first place. They cannot revoke their own SuperAdmin role.

        if (userCurrentRoles.includes('SuperAdmin')) {


            // Fetch who assigned the SuperAdmin role
            const assignedByResult = await pool.query(
                `SELECT assigned_by_user_id
                 FROM user_roles
                 INNER JOIN roles ON user_roles.role_id = roles.role_id
                 WHERE user_roles.user_id = $1 AND roles.role_name = 'SuperAdmin'`,
                [userId]
            );

            const assignedByUser = assignedByResult.rows[0]?.assigned_by_user_id;

            // Prevent self-revocation of SuperAdmin role
            if (loggedInUser === userId) {
                if (rolesToAdd.includes('SuperAdmin') || rolesToRemove.includes('SuperAdmin')) {
                    return res.status(403).json({ error: t('usersController.cannotRevokeYourSuperAdminRole') });


                }
            }


            // Allow only the user who assigned the SuperAdmin role to revoke it, allow superadmins to modify their own roles, except revoke SuperAdmin role.
            if (assignedByUser !== loggedInUser && loggedInUser !== userId) {
                return res.status(403).json({ error: t('usersController.superAdminsCanModifySuperAdminsIf') });
            }


            // Transfer ownership of roles assigned by this SuperAdmin
            await transferAssignedRoles(userId, loggedInUser);


        }




        // Step 13: Prevent non-SuperAdmins from revoking their own Admin role
        if (rolesToRemove.includes('Admin') && loggedInUser === userId) {
            // Check if logged-in user is not a SuperAdmin
            if (!loggedInUserRoles.includes('SuperAdmin')) {
                return res.status(403).json({ error: t('usersController.cannotRevokeYourAdminRole') });
            }
        }


        // Allow SuperAdmins to revoke Admin roles freely
        if (loggedInUserRoles.includes('SuperAdmin')) {

            const adminAssignedByResult = await pool.query(
                `SELECT assigned_by_user_id
            FROM user_roles
            INNER JOIN roles ON user_roles.role_id = roles.role_id
            WHERE user_roles.user_id = $1 AND roles.role_name = 'Admin'`,
                [userId]
            );


        }



        // Step 14: Remove existing roles from the user (only the roles that need to be removed)
        if (rolesToRemove.length > 0) {
            const deletePromises = rolesToRemove.map(role => {
                return pool.query(
                    'DELETE FROM user_roles WHERE user_id = $1 AND role_id = (SELECT role_id FROM roles WHERE role_name = $2)',
                    [userId, role]
                );
            });

            // Execute all deletions for roles that need to be removed
            await Promise.all(deletePromises);
        }

        // Step 16: Assign new roles to the user, including the tracking of who assigned the role
        const rolePromises = rolesToAdd.map(role => {
            return pool.query(
                'INSERT INTO user_roles (user_id, role_id, assigned_by_user_id) ' +
                'SELECT $1, role_id, $2 FROM roles WHERE role_name = $3',
                [userId, loggedInUser, role]
            );
        });

        // Execute all role insertions (only for the new roles)
        await Promise.all(rolePromises);


        // Revalidate after insertion
        const updatedUserRolesResult = await pool.query(
            `SELECT role_name FROM user_roles
     INNER JOIN roles ON user_roles.role_id = roles.role_id
     WHERE user_roles.user_id = $1`,
            [userId]
        );

        const updatedUserRoles = updatedUserRolesResult.rows.map(row => row.role_name);

        if (updatedUserRoles.includes('SuperAdmin') && !loggedInUserRoles.includes('SuperAdmin')) {
            return res.status(403).json({ error: 'Only a SuperAdmin can assign or retain the SuperAdmin role' });
        }

        // Step 17: Log role changes in role_change_logs
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

        // Step 18: Update the subscription status if the "User_subscribed" role is removed
        if (rolesToRemove.includes('User_subscribed')) {
            await pool.query(
                'UPDATE subscriptions SET is_active = false WHERE user_id = $1',
                [userId]
            );
        }

        // Step 19: Update the subscription status if the "User_subscribed" role is removed
        if (rolesToAdd.includes('User_subscribed')) {
            await pool.query(
                'UPDATE subscriptions SET is_active = true WHERE user_id = $1',
                [userId]
            );
        }

        // Step 20: Insert into the subscriptions table when the "User_subscribed" role is assigned
        if (rolesToAdd.includes('User_subscribed')) {
            await pool.query(
                'INSERT INTO subscriptions (user_id, start_date, renewal_due_date, is_active, created_by_user_id) VALUES ($1, NOW(), NOW() + INTERVAL \'1 year 7 days\', true, $2)',
                [userId, loggedInUser]
            );
        }

        // Step 21: Execute all log insertions
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
                return res.status(200).json({
                    isActive: true,
                    renewalDueDate
                });
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
    getUserById,
    getAllUsers,
    updateUser,
    softDeleteUser,
    uploadProfilePicture,
    updateRoles,
    subscribeUser,
    getSubscriptionStatus,
    // hardDeleteUser,
    adminVersionSoftDeleteUser
};
