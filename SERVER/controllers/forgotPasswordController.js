const pool = require('../config/db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
// const { checkout } = require('../routes/root');

const BASE_URL = process.env.REMOTE_CLIENT_APP;

const handlePost = async (req, res) => {
  const { email } = req.body;
  try {

    const data = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const oldUser = data.rows;
    // console.log(typeof oldUser)
    // const oldUser = await User.findOne({email: email}).exec();

    // console.log("oldUser", oldUser)

    if (oldUser.length === 0) {
      // return res.json({status: "User does not exist"});
      return res.sendStatus(403)
      //  console.log("Does not exist")
    } else {

      const secret = process.env.ACCESS_TOKEN_SECRET + oldUser[0].password;
      const token = jwt.sign({ email: oldUser[0].email, id: oldUser[0].useruser_id }, secret, { expiresIn: '15m' });
      const link = `${BASE_URL}/forgot-password/${oldUser[0].user_id}/${token}`;

      // console.log("link", link)

      let transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: process.env.RESET_EMAIL_CLIENT,
        port: process.env.RESET_EMAIL_PORT,
        auth: {
          user: process.env.RESET_EMAIL,
          pass: process.env.RESET_EMAIL_PASSWORD
        }
      });

      // let mailOptions = {
      //   from: process.env.RESET_EMAIL,
      //   to: email,
      //   subject: 'PASSWORD RESET FULLSTACK TEMPLATE',
      //   text: `This link is valid for 15 minutes. Follow the instructions to enter a valid password: ${link} `
      // };

      let mailOptions = {
        from: process.env.RESET_EMAIL,
        to: email,
        subject: 'Password Reset - Fullstack Template',
        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Password Reset</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
                  color: #333;
                }
                .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: var(--color13, lightblue);
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }
                .email-header {
                  background-color: var(--color9, darkblue);
                  color: var(--color1, white);
                  padding: 20px;
                  text-align: center;
                  font-size: 24px;
                }
                .email-body {
                  padding: 20px;
                  background-color: var(--color1, white);
                }
                .email-body p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #333;
                }
                .reset-link {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  font-size: 16px;
                  color: var(--color1, white);
                  background-color: var(--color9, darkblue);
                  text-decoration: none;
                  border-radius: 4px;
                  transition: background-color 0.3s ease;
                }
                .reset-link:hover {
                  background-color: var(--color13, lightblue);
                  color: var(--color9, darkblue);
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="email-header">
                  Password Reset Request - Fullstack Template
                </div>
                <div class="email-body">
                  <p>
                    Hi there,
                  </p>
                  <p>
                    We received a request to reset your password. This link is valid for 15 minutes. Please click the button below to set a new password.
                  </p>
                  <a href="${link}" class="reset-link">Reset Password</a>
                  <p>
                    If you did not request a password reset, please ignore this email. Your account is still secure.
                  </p>
                  <p>
                Thank you!
                  </p>
                </div>
              </div>
            </body>
          </html>
        `
      };
      

      // Make sendMail async to wait for completion
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            console.log('Email sent: ' + info.response);
            resolve();
          }
        });
      });

      return res.status(200).json({
        status: 'An email with instructions to reset your password has been sent. Please check your inbox or spam folder'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'Something went wrong, please try again' });
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
      await pool.query('UPDATE users SET password=$1 WHERE user_id=$2', [hashedPwd, id]) //foundUser[0].useruser_id????

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