const pool = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT 
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
            GROUP BY 
                u.user_id, u.username, u.email, u.is_active, u.is_verified, u.location;`);
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
        res.status(200).json({ success: true, message: 'User successfully deleted, and associated files removed', user: result.rows[0] });

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
  
      // Step 4: Fetch the user to update from the database
      const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Step 5: Fetch all roles from the roles table to validate the role names
      const availableRolesResult = await pool.query('SELECT * FROM roles');
      const availableRoles = availableRolesResult.rows.map(role => role.role_name); // Get all role names
  
      // Step 6: Validate the roles provided by the admin
      const invalidRoles = roles.filter(role => !availableRoles.includes(role));
      if (invalidRoles.length > 0) {
        return res.status(400).json({ error: `Invalid roles: ${invalidRoles.join(', ')}` });
      }
  
      // Step 7: Remove existing roles from the user
      await pool.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);
  
      // Step 8: Assign new roles to the user
      const rolePromises = roles.map(role => {
        return pool.query(
          'INSERT INTO user_roles (user_id, role_id) SELECT $1, role_id FROM roles WHERE role_name = $2',
          [userId, role]
        );
      });
      await Promise.all(rolePromises); // Execute all role insertions
  
      res.status(200).json({ message: 'Roles updated successfully' });
    } catch (error) {
      console.error('Error updating roles:', error);
      res.status(500).json({ error: 'Failed to update roles' });
    }
  };
  
  


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadProfilePicture,
    updateRoles
};
