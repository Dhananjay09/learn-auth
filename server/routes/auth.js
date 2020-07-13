const express = require("express");
const router = express.Router();

router.post("/signup", (__, res) => res.json("Welcome"));

module.exports = router;
