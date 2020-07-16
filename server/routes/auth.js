const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  activateAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/signup", signUp);

router.post("/account-activation", activateAccount);

router.post("/signin", signIn);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
