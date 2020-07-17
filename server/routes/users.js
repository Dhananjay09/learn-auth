const express = require("express");
const router = express.Router();
const { listUsers } = require("../controllers/users");

router.get("/list-users", listUsers);

module.exports = router;
