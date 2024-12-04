const pool = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    const { user_id } = req.params; // Extract user_id from request parameters
    try {
        const result = await pool.query(
            'SELECT username, email FROM users WHERE user_id = $1',
            [user_id]
        );

        if (result.rows.length === 0) {
            // If no user is found, return a 404 status
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]); // Respond with the user data
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
const deleteUser = async (req, res) => {
    const { userId } = req.params; // Extract user_id from request parameters

    try {
        // Step 1: Delete the user from the 'users' table
        const result = await pool.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING *',
            [userId]
        );

        if (result.rows.length === 0) {
            // If no rows were returned, the user was not found
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Delete the user's profile picture file (if it exists)
        const profilePicturePath = path.join(__dirname, '..', 'media', 'profile_pictures', userId, 'profilePicture.jpg');

        if (fs.existsSync(profilePicturePath)) {
            fs.unlink(profilePicturePath, (err) => {
                if (err) {
                    console.error('Error deleting profile picture:', err);
                } else {
                    console.log('Profile picture deleted successfully');
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
                console.log('User folder deleted successfully');
            }
        });

        // Step 4: Send a success response
        res.status(200).json({ success: true, message: 'User successfully deleted, and associated files removed', user: result.rows[0] });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
