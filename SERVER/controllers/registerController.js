const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { response } = require('express');



const handleNewUser = async (req, res) => {


    const { user, pwd, email } = req.body;


    if (!user || !pwd || !email) return res.status(400).json({ 'message': 'Username, email and password are required.' });

     //encrypt the password
     const hashedPwd = await bcrypt.hash(pwd, 10);

    let duplicate = false;

try {
    pool.query('SELECT * FROM users WHERE username = $1 OR email = $2 AND is_active = true', [user, email], (error, results) => {
        // console.log(results.rows.length)
        if (results.rows.length > 0) {
            duplicate = true
        }
        if (duplicate) return res.sendStatus(409); //Conflict 

        try {
   

    pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [user, email, hashedPwd], (error, results) => {
        // console.log(results)
    })

    res.status(201).json({ 'success': `New user ${user} created!` });
} catch (err) {
    res.status(500).json({ 'message': err.message });
}

    });
} catch (err) {
    console.log(err)
}



}

module.exports = { handleNewUser };