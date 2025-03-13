const pool = require('../config/db');

// Function to get all users

const getAllUsers = async (req, res) => {
    try {
        const { username } = req.query;

        // Start the base query
        let query = `
            SELECT u.user_id, u.username, u.is_active
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
            GROUP BY u.username, u.user_id
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


// Function to get all muted users

const getMutedUsers = async (req, res) => {
    try {
        const { userId } = req.query;


        console.log("userId", userId)
        // Ensure that userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Query to fetch muted users
        const result = await pool.query(
            'SELECT * FROM muted WHERE mute = true AND (muter = $1 OR mutee = $1)', 
            [userId]
        );

        // If no muted users found, log a message
        if (result.rows.length === 0) {
            console.log('No muted users found');
        }

        // Return the result
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving muted users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = {
    getAllUsers,
    getMutedUsers
};
