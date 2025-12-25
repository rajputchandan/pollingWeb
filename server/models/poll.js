const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },

    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true
        },
        votes: {
          type: Number,
          default: 0
        }
      }
    ],

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true
    },

    // 🔒 to ensure one user = one vote
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);



module.exports = mongoose.model("Poll", pollSchema);
