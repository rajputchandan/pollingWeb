import { Box } from "@mui/material";
import Sidebar from "../component/Sidebar";

const drawerWidth = 260;

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <Box
        component="main"
        sx={{
          ml: `${drawerWidth}px`,   // ✅ ONLY HERE
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          p: 4,
          overflowX: "hidden"
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
