import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex"
      }}
    >
      {/* ================= LEFT IMAGE ================= */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage:
            "url(https://www-cdn.polleverywhere.com/assets/img-text/turn-phones-into-learning-tools-cb93c13848d53b4dddd3c2533c2bd7f0e4cce84436f8da0bf1ceaf72faf88d53.png)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* ================= RIGHT REGISTER ================= */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc"
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={1}>
            Create Account
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            Join and start creating polls & events
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleRegister}
          >
            Register
          </Button>

          <Typography
            mt={3}
            textAlign="center"
            variant="body2"
          >
            Already have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/login")}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
