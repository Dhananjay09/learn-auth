const express = require("express");
const router = express.Router();
const {
  signUp,
  accountActivation,
  signIn,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignupValidator, runValidation, signUp);
router.post("/account-activation", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signIn);

// forgot password route
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;
