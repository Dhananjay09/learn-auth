const express = require("express");
const router = express.Router();
const { signUp } = require("../controllers/auth");

router.post("/signup", signUp);

router.post("/account-activation", (__, res) =>
  res.json({ welcome: "Welcome" })
);

router.post("/signin", (__, res) => res.json({ welcome: "Sign In" }));

router.post("/forgot-password", (__, res) =>
  res.json({ welcome: "Forgot Password" })
);

router.post("/reset-password", (__, res) =>
  res.json({ welcome: "Reset Password" })
);

module.exports = router;
