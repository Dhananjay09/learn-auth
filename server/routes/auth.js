const express = require("express");
const router = express.Router();

router.post("/signup", (__, res) => res.json({ welcome: "Sign up" }));

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
