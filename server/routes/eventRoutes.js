const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createEvent,
  getMyEvents,
  inviteByEmail,
  getEventById,
  getDashboardEvents,
  getEventFullDetails,
  deleteEvent
} = require("../controller/eventController");

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getMyEvents);
router.get("/dashboard", protect, getDashboardEvents);


router.post("/:eventId/invite", protect, inviteByEmail);
router.get("/:id/details", protect, getEventFullDetails);
router.delete("/:id", protect, deleteEvent);


router.get("/:id", protect, getEventById);

module.exports = router;
