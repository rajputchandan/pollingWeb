const Poll = require("../models/poll");
const Event = require("../models/event");

// ================= CREATE POLL =================
exports.createPoll = async (req, res) => {
  try {
    const { eventId, question, options } = req.body;

    // 1️⃣ Event exist check
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2️⃣ Authorization check
    const isAllowed = event.participants.some(
      (id) => id.toString() === req.user
    );

    if (!isAllowed) {
      return res.status(403).json({
        message: "You are not allowed to add poll to this event"
      });
    }

    // 3️⃣ Validate options
    if (!options || options.length < 2) {
      return res
        .status(400)
        .json({ message: "At least 2 options required" });
    }

    // 4️⃣ Create poll
    const poll = await Poll.create({
      eventId,
      question,
      options,
      voters: []
    });

    res.status(201).json(poll);
  } catch (error) {
    console.error("CREATE POLL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= VOTE POLL =================
exports.votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // 1️⃣ Duplicate vote check (FIXED)
    const alreadyVoted = poll.voters.some(
      (id) => id.toString() === req.user
    );

    if (alreadyVoted) {
      return res
        .status(400)
        .json({ message: "You have already voted" });
    }

    // 2️⃣ Option index validation
    if (
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return res.status(400).json({ message: "Invalid option" });
    }

    // 3️⃣ Vote increment
    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user);

    await poll.save();
    res.json(poll);
  } catch (error) {
    console.error("VOTE POLL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET POLLS BY EVENT =================
exports.getPollsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1️⃣ Event exist check
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2️⃣ Authorization FIX 🔥
    const isAllowed = event.participants.some(
      (id) => id.toString() === req.user
    );

    if (!isAllowed) {
      return res.status(403).json({
        message: "You are not allowed to view polls of this event"
      });
    }

    // 3️⃣ Fetch polls
    const polls = await Poll.find({ eventId }).sort({
      createdAt: -1
    });

    res.json(polls);
  } catch (error) {
    console.error("GET POLLS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
