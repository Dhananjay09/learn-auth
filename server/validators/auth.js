const { check } = require("express-validator");

const MIN = 6;

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name field is required"),
  check("email").isEmail().withMessage("Must be a valid email!!"),
  check("password")
    .isLength({ min: MIN })
    .withMessage(`Password must be atleast ${MIN} characters long`),
];

exports.userSigninValidator = [
  check("email").isEmail().withMessage("Must be a valid email!!"),
  check("password")
    .isLength({ min: MIN })
    .withMessage(`Password must be atleast ${MIN} characters long`),
];

exports.forgotPasswordValidator = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email!!"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: MIN })
    .withMessage(`Password must be atleast ${MIN} characters long`),
];
