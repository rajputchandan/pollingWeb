
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
// console.log(dotenv)/

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

/* ================= SERVE REACT ================= */
const frontendPath = path.join(__dirname, "../pl/dist");
console.log("Frontend path:", frontendPath);

app.use(express.static(frontendPath));

/* ⚠️ Express v5 FIX — DO NOT use app.get("*") */
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
