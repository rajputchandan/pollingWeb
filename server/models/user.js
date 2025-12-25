const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// ✅ Mongoose v7+ compatible
userSchema.pre("save", async function () {
  // password change nahi hua to kuch mat karo
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// password compare helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// overwrite-safe export
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
