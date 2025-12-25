const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMyNotifications } = require("../controller/notificationController");

const router = express.Router();

router.get("/", protect, getMyNotifications);

module.exports = router;
