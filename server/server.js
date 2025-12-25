const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const connectDB = require("./config/db");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// DB connect
connectDB();


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/polls", require("./routes/pollRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use("/api/users", require("./routes/userRoutes"));


// ===== FRONTEND SERVE =====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/dist/index.html")
    );
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
