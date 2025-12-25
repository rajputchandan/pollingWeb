const Event = require("../models/event");
const User = require("../models/user");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");


// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      createdBy: req.user,
      participants: [req.user]   // 🔥 SIMPLE & CORRECT
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};







// Get My Events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      participants: req.user
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json(events);
  } catch (error) {
    console.error("GET MY EVENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔐 Authorization
    const isAllowed = event.participants.some(
      (id) => id.toString() === req.user
    );

    if (!isAllowed) {
      return res.status(403).json({
        message: "Not allowed to view this event"
      });
    }

    res.json(event);
  } catch (error) {
    console.error("GET EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


const Poll = require("../models/poll");

exports.getDashboardEvents = async (req, res) => {
  try {
    const userId = req.user;

    const events = await Event.find({
      participants: userId
    }).sort({ createdAt: -1 });

    const myEvents = [];
    const invitedEvents = [];

    for (let event of events) {
      const polls = await Poll.find({ eventId: event._id });

      let totalVotes = 0;
      polls.forEach((poll) => {
        poll.options.forEach((opt) => {
          totalVotes += opt.votes;
        });
      });

      const eventData = {
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        participantsCount: event.participants.length,
        pollsCount: polls.length,
        totalVotes
      };

      // 🔥 OWNER vs PARTICIPANT LOGIC
      if (event.createdBy.toString() === userId) {
        myEvents.push(eventData);
      } else {
        invitedEvents.push(eventData);
      }
    }

    res.json({
      myEvents,
      invitedEvents
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE EVENT (HOST ONLY + CASCADE DELETE)
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔒 Only creator can delete
    if (event.createdBy.toString() !== req.user) {
      return res
        .status(403)
        .json({ message: "Not authorized" });
    }

    // 🔥 1️⃣ DELETE ALL POLLS OF THIS EVENT
    await Poll.deleteMany({ eventId });

    // 🔥 2️⃣ DELETE NOTIFICATIONS (OPTIONAL)
    // await Notification.deleteMany({ eventId });

    // 🔥 3️⃣ DELETE EVENT ITSELF
    await event.deleteOne();

    res.json({
      message:
        "Event and all related polls deleted successfully"
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getEventFullDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // authorization
    const isAllowed = event.participants.some(
      (u) => u._id.toString() === req.user
    );

    if (!isAllowed) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const polls = await Poll.find({ eventId: event._id });

    // 🔹 enhance polls with results
    const pollsWithStats = polls.map((poll) => {
      const totalVotes = poll.options.reduce(
        (sum, o) => sum + o.votes,
        0
      );

      const votedUsers = poll.voters.map((id) =>
        id.toString()
      );

      const pendingUsers = event.participants
        .filter(
          (p) => !votedUsers.includes(p._id.toString())
        )
        .map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email
        }));

      return {
        _id: poll._id,
        question: poll.question,
        options: poll.options,
        totalVotes,
        votedUsers,
        pendingUsers
      };
    });

    res.json({
      event: {
        id: event._id,
        title: event.title,
        description: event.description,
        date: event.date
      },
      participants: event.participants,
      polls: pollsWithStats
    });
  } catch (error) {
    console.error("EVENT FULL DETAILS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



exports.inviteByEmail = async (req, res) => {
  try {
    const { eventId } = req.params;   // ✅ CORRECT
    const { emails } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user) {
      return res.status(403).json({ message: "Only creator can invite" });
    }

    const invitedUsers = [];

    for (let email of emails) {
      const user = await User.findOne({ email });
      if (!user) continue;

      if (!event.participants.includes(user._id)) {
        event.participants.push(user._id);

        // 🔔 Notification
        await Notification.create({
          user: user._id,
          message: `You are invited to event: ${event.title}`,
          eventId: event._id
        });

        // 📧 EMAIL
 await sendEmail(
  user.email,
  "Event Invitation",
  `
  <div style="font-family: Arial; line-height:1.5">
    <h2>📢 Event Invitation</h2>
    <p>Hello <b>${user.name}</b>,</p>
    <p>You are invited to:</p>
    <h3>${event.title}</h3>
    <p>${event.description || ""}</p>
    <p>Login to participate in the poll.</p>
  </div>
  `
);



        invitedUsers.push(email);
      }
    }

    await event.save(); 

    res.json({
      message: "Invitations sent successfully",
      invitedUsers
    });
  } catch (error) {
    console.error("INVITE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};








