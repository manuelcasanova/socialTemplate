const pool = require('../config/db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
// const { checkout } = require('../routes/root');

const BASE_URL = process.env.REMOTE_CLIENT_APP;

const handlePost = async (req, res) => {
  const { email } = req.body;
  // console.log("req body", req.body) //OK
  // try {

    const data = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const oldUser = data.rows;
    // console.log("oldUSer", oldUser) //OK
// console.log(typeof oldUser)
    // const oldUser = await User.findOne({email: email}).exec();

    if (oldUser.length === 0) {
      // return res.json({status: "User does not exist"});
      return res.sendStatus(403)
      //  console.log("Does not exist")
    } else {
   

      const secret = process.env.ACCESS_TOKEN_SECRET + oldUser[0].password;
      const token = jwt.sign({ email: oldUser[0].email, id: oldUser[0].user_id }, secret, { expiresIn: '15m' });
      const link = `${BASE_URL}/forgot-password/${oldUser[0].user_id}/${token}`;
  
      // console.log("link", link)
  
      let transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: process.env.RESET_EMAIL_CLIENT,
        port: process.env.RESET_EMAIL_PORT,
        auth: {
          user: process.env.RESET_EMAIL,
          pass: process.env.RESET_EMAIL_PASSWORD
        },
  secure: process.env.RESET_EMAIL_PORT === "465", 
      });

      // console.log("transporter", transporter)
  
      let mailOptions = {
        from: process.env.RESET_EMAIL,
        to: email,
        subject: 'PASSWORD RESET FULLSTACK TEMPLATE',
        text: `This link is valid for 15 minutes. Follow the instructions to enter a valid password: ${link} `
      };

      // console.log("mail options", mailOptions)
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

       res.json()

    }

    // console.log(link)

  // } catch (err) {
  //   console.log(err);
  // }
}

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