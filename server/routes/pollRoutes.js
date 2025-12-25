const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createPoll,
  votePoll,
  getPollsByEvent
} = require("../controller/pollController");

const router = express.Router();

router.post("/", protect, createPoll);
router.post("/vote", protect, votePoll);
router.get("/:eventId", protect, getPollsByEvent);

module.exports = router;
