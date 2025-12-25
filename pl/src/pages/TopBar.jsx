import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">
          Event & Poll Dashboard
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography>{user?.name}</Typography>
          <Avatar>{user?.name?.[0]}</Avatar>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
