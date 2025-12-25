const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controller/userController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, getAllUsers);

module.exports = router;
