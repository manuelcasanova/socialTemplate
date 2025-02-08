const pool = require('../config/db');

// Function to get all users

const getAllUsers = async (req, res) => {
    try {
        const { username } = req.query;

        // Start the base query
        let query = `
            SELECT u.username 
            FROM users u
            WHERE u.is_active = true 
        `;
        const params = [];

        // Add filters to the query based on the req.query parameters
        if (username) {
            query += ` AND u.username ILIKE $${params.length + 1}`;
            params.push(`%${username}%`);  // Use ILIKE for case-insensitive matching
        }

        // Add the GROUP BY and execute the query
        query += `
            GROUP BY u.username
        `;

        // Execute the query
        const result = await pool.query(query, params);

        // If no users found, log a message
        if (result.rows.length === 0) {
            console.log('No users found');
        }

        // Return the result
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};






module.exports = {
    getAllUsers
};
