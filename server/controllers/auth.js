const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const User = require("../models/user");

// Configure nodemailer to use a service for sending mails
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
      console.log(err);

      return res.status(422).json({
        error: "Something went wrong!!",
      });
    }

    if (user) {
      return res.status(400).json({
        error: "Email already exists.",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const emailData = {
      to: [
        {
          address: email,
          name: name,
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
      <a href="${process.env.CLIENT_URL}/auth/activate/${token}"  target="_blank">${process.env.CLIENT_URL}/auth/activate/${token}</a>

      <hr />

      <p>This email may contain sensitive information</p>
      <a href="${process.env.CLIENT_URL}" target="_blank">${process.env.CLIENT_URL}</a>
      </div>

      `,
    };

    // Send email using the construct transport we created at the beginning of the file
    transport.sendMail(emailData, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: err,
        });
      }

      console.info(info);

      res.json({
        message: `Email has been successfully sent to ${email}. Follow  the instructions in the email to activate your account.`,
      });
    });

    // let newUser = new User({ name, email, password });

    // newUser.save((err, userData) => {
    //   if (err) {
    //     console.log(err);

    //     return res.status(400).json({
    //       error: "Error saving the data!!",
    //     });
    //   }

    //   res.json({
    //     message: `Hey ${name}, welcome to the app!!`,
    //   });
    // });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    // verify token
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err) => {
      if (err) {
        console.log("Account activation error:", err);

        return res.status(401).json({
          error: "The link has expired.",
        });
      }

      const { name, email, password } = jwt.decode(token);

      let newUser = new User({
        name,
        email,
        password,
      });

      // TODO: You can avoid this line. Consider this an assignment. Think about how would you replace it
      User.findOne({ email }).exec((err, user) => {
        if (err) {
          console.log(err);

          return res.status(422).json({
            error: "Something went wrong!!",
          });
        }

        if (user) {
          return res.status(400).json({
            error: "The account has already been activated.",
          });
        }

        newUser.save((err, userData) => {
          if (err) {
            console.log(err);

            return res.status(400).json({
              error: "Error in creating a new account. Please try again.",
            });
          }

          res.json({
            message: `Hey ${name}, welcome to the app!!`,
          });
        });
      });
    });
  } else {
    return res.status(401).json({
      error: "The token isn't available",
    });
  }
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with the email specified doesn't exist.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Password is incorrect.",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, role, email } = user;

    return res.json({
      token,
      user: {
        _id,
        email,
        role,
        name,
      },
      message: "Signed in successfully",
    });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error:
          "User with the specified email doesn't exist. Please check the email ID",
      });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Link",
      html: `
        <h1>Please use the following link to reset your password</h1>

        <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}" target="_blank">${process.env.CLIENT_URL}/auth/password/reset/${token}</a>
      `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "There was an error saving the reset password link",
        });
      }

      transport
        .sendMail(emailData)
        .then(() => {
          return res.json({
            message: `Email has been successfully sent to ${email}`,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            error: "There was an error while sending the email",
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err) => {
      if (err) {
        return res.status(400).json({
          error: "Expired link. Try again",
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "Something went wrong. Try later",
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);

        user.save((err) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting the password",
            });
          }

          return res.json({
            message: "Great! The password has been reset",
          });
        });
      });
    });
  }
};
