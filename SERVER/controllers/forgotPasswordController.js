const pool = require('../config/db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
// const { checkout } = require('../routes/root');

const BASE_URL = process.env.REMOTE_CLIENT_APP;

const handlePost = async (req, res) => {
  const { email } = req.body;
  // Get user data from DB
  const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const oldUser = data.rows;

  if (oldUser.length === 0) {
    return res.sendStatus(403); // User not found
  } else {
    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser[0].password;
    const token = jwt.sign({ email: oldUser[0].email, id: oldUser[0].user_id }, secret, { expiresIn: '15m' });
    const link = `${BASE_URL}/forgot-password/${oldUser[0].user_id}/${token}`;

    let transporter = nodemailer.createTransport({
      host: process.env.RESET_EMAIL_CLIENT,
      port: process.env.RESET_EMAIL_PORT,
      auth: {
        user: process.env.RESET_EMAIL,
        pass: process.env.RESET_EMAIL_PASSWORD
      },
      secure: process.env.RESET_EMAIL_PORT === "465", 
    });

    let mailOptions = {
      from: process.env.RESET_EMAIL,
      to: email,
      subject: 'PASSWORD RESET FULLSTACK TEMPLATE',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #007bff;">Password Reset Request for FULL STACK TEMPLATE</h2>
              <p style="font-size: 16px;">Hello,</p>
              <p style="font-size: 16px;">You requested a password reset. Please follow the link below to reset your password:</p>
              <p style="font-size: 16px; font-weight: bold;">
                <a href="${link}" style="color: #007bff; text-decoration: none;">Reset Your Password</a>
              </p>
              <p style="font-size: 14px; color: #666;">
                This link is valid for 15 minutes. After this time, you will need to request a new password reset.
              </p>
              <p style="font-size: 14px; color: #666;">
                If you didn't request a password reset, please ignore this email.
              </p>
              <footer style="margin-top: 20px; font-size: 12px; color: #999;">
                <p>Thank you!</p>
              </footer>
            </div>
          </body>
        </html>`
    };

    try {
      // Await the email sending process
      await transporter.sendMail(mailOptions);
      console.log('Email sent: 250 OK');

      // Once the email is sent, send the response back to the client
      return res.status(200).json({ status: 'Password reset email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ status: 'Failed to send email', error: error.message });
    }
  }
};


const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const handlePostVerified = async (req, res) => {
  // console.log("req", req.params)
  //console.log("req body password", req.body.password)
  const { id, token } = req.params;
  const { password } = req.body;

  if (password === "") {
    return res.json({ status: 'Field cannot be empty' })
  }

  if (!PWD_REGEX.test(password)) {
    return res.json({ status: '8 to 24 characters. Must include uppercase and lowecase letters, a number and a special character: ! @ # $' })
  }

  try {

    const data = await pool.query('SELECT * FROM users WHERE user_id = $1', [id])
    const oldUser = data.rows;


    if (!oldUser) {
      return res.json({ status: 'This email is not in our database' })
    }
    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser[0].password;
    try {
      const verifyJWT = jwt.verify(token, secret)
      const hashedPwd = await bcrypt.hash(password, 10);
      // await User.updateOne({user_id: id}, {$set: {password: hashedPwd}})
      await pool.query('UPDATE users SET password=$1 WHERE user_id=$2', [hashedPwd, id]) //foundUser[0].user_id ????

      //res.json({status: "Password updated"});

      res.render("index", { email: verifyJWT.email, status: "verified" })
    } catch (err) {
      console.log(err)
      res.json({ status: "Something went wrong" })
    }

  } catch (error) {
    console.log(error)
  }


}

const handleGet = async (req, res) => {
  // console.log("req", req.params)
  const { id, token } = req.params;


  try {
    const data = await pool.query('SELECT * FROM users WHERE user_id = $1', [id])
    const oldUser = data.rows;
    if (!oldUser) {
      return res.json({ status: 'This email is not in our database' })
    }

    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser[0].password;
    try {
      const verifyJWT = jwt.verify(token, secret)
      res.render("index", { email: verifyJWT.email, status: "Not verified" })
    } catch (err) {
      console.log(err)
      // res.send("Not verified")
    }

  } catch (error) {
    console.log(error)
  }



}

module.exports = {
  handlePost,
  handleGet,
  handlePostVerified
}