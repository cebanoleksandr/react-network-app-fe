import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: '#EDEEF0' }}>
      <Header />

      <Box component="main" sx={{ p: 2 }}>
        <Box sx={{ flex: 1, maxWidth: "1200px", mx: "auto", position: "relative" }}>
          <Sidebar />
          <Box sx={{ pl: '220px' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
