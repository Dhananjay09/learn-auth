const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/auth");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3108c4b48ddc5d",
    pass: "536323607d8bae",
  },
});

exports.signUp = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return res.status(401).json({
        error: "Something went wrong!!",
      });
    }

    if (user) {
      return res.status(400).json({
        error: "Email already exists!!",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const activateLink = `${process.env.CLIENT_URL}/auth/activate/${token}`;

    const emailData = {
      to: [
        {
          address: email,
          name,
        },
      ],
      from: {
        address: process.env.EMAIL_FROM,
        name: "MERN, AUTH",
      },
      subject: "Account Activation Link",
      html: `
        <div>
          <h1>Please use the following link to activate the account.</h1>

          <a href="${activateLink}" target="_blank">
            ${activateLink}
          </a>

          <hr />

          <p>This email contains sensitive information</p>
          <a href="${process.env.CLIENT_URL}" target="_blank">
            ${process.env.CLIENT_URL}
          </a>
        </div>
      `,
    };

    transport.sendMail(emailData, (err, info) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      res.json({
        message: `Email has been successfully sent to ${email}. Follow the instructions i the email to activate your account.`,
      });
    });
  });
};

exports.activateAccount = (req, res) => {
  const { token } = req.body;

  if (token) {
    return jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err) => {
      if (err) {
        return res.status(401).json({
          error: "The link has expired.",
        });
      }

      const { name, email, password } = jwt.decode(token);

      const newUser = new User({ name, email, password });

      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Something went error.",
          });
        }

        if (user) {
          return res.status(400).json({
            error: "The account has already been activated.",
          });
        }

        newUser.save((err, userData) => {
          if (err) {
            return res.status(400).json({
              error: "Something went error.",
            });
          }

          res.json({
            message: `Hey ${name}, welcome to the app!!`,
          });
        });
      });
    });
  }

  return res.status(401).json({
    error: "The token is invalid",
  });
};

exports.signIn = (__, res) => res.json({ welcome: "Sign In" });
