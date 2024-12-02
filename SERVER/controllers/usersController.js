const pool = require('../config/db'); 
const bcrypt = require('bcrypt');

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



module.exports = {
    getAllUsers,
    getUserById,
    updateUser
};
