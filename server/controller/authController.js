const User = require("../models/user");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    const normalizedEmail = email.toLowerCase();

    const userExists = await User.findOne({
      email: normalizedEmail
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists" });
    }

  
    const user = await User.create({
      name,
      email: normalizedEmail,
      password
    });

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    // 👇 must select password explicitly
    const user = await User.findOne({
      email: normalizedEmail,
      isActive: true
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials" });
    }

    // 👇 model method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
