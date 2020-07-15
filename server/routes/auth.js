const express = require("express");
const router = express.Router();
const { signUp, signIn, activateAccount } = require("../controllers/auth");

router.post("/signup", signUp);

router.post("/account-activation", activateAccount);

router.post("/signin", signIn);

router.post("/forgot-password", (__, res) =>
  res.json({ welcome: "Forgot Password" })
);

router.post("/reset-password", (__, res) =>
  res.json({ welcome: "Reset Password" })
);

module.exports = router;
