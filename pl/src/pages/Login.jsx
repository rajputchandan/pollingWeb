import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper
} from "@mui/material";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
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

      {/* ================= RIGHT LOGIN ================= */}
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
            Welcome Back 
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            Login to manage your events & polls
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography
            mt={3}
            textAlign="center"
            variant="body2"
          >
            Don’t have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/register")}
            >
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
