const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { response } = require('express');

const usernameRegex = /^[A-z][A-z0-9-_]{3,23}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).{8,24}$/;
const emailRegex = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const handleNewUser = async (req, res) => {
    let { user, pwd, email, role } = req.body;

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

    if (!user || !pwd || !email) {
        return res.status(400).json({ 'message': 'Username, email, and password are required.' });
    }

    // Normalize username (capitalize the first letter and lowercase the rest)
    user = user.charAt(0).toUpperCase() + user.slice(1).toLowerCase();


    // Default role if not provided (if the role is user_subscribed, for example)
    const userRole = role || 'user_not_subscribed'; // Default role can be 'user_not_subscribed'

    try {
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Check if the username or email already exists
        const duplicateCheckQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2 AND is_active = true';
        const result = await pool.query(duplicateCheckQuery, [user, email]);

        if (result.rows.length > 0) {
            return res.status(409).json({ 'message': 'User with that username or email already exists.' });
        }

        // Insert the new user into the 'users' table
        const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id';
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

        // Respond with success
        res.status(201).json({ 'success': `New user ${user} created with roles: ${roleAssignments.join(', ')}.` });
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


module.exports = { handleNewUser };
