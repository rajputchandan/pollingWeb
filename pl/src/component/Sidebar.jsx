import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 260;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Create Event", icon: <AddIcon />, path: "/create-event" },
    { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" }
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
       
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "#0f172a",
          color: "#fff",
           overflowX: "hidden"  
        },
        
      }}
    >
      {/* APP TITLE */}
      <Box p={3}>
        <Typography variant="h6" fontWeight={700}>
           Polling System
        </Typography>
        <Typography variant="caption" color="gray">
          Event & Voting
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "#1e293b" }} />

      {/* USER INFO (TOPBAR DATA MOVED HERE) */}
      <Box p={3} display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: "#38bdf8" }}>
          {user?.name?.[0]}
        </Avatar>

        <Box>
          <Typography fontWeight={600}>
            {user?.name}
          </Typography>
         <Typography
  variant="caption"
  color="gray"
  sx={{
    maxWidth: 170,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }}
  title={user?.email}  
>
  {user?.email}
</Typography>

        </Box>
      </Box>

      <Divider sx={{ bgcolor: "#1e293b" }} />

      {/* MENU */}
      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              "&.Mui-selected": {
                bgcolor: "#1e293b"
              }
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box flexGrow={1} />

      <Divider sx={{ bgcolor: "#1e293b" }} />

      {/* LOGOUT */}
      <Box p={2}>
        <Button
          fullWidth
          color="error"
          startIcon={<LogoutIcon />}
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
