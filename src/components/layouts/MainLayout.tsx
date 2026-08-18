import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CustomAlert from "../UI/CustomAlert";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header onMenuClick={() => setMobileOpen((prev) => !prev)} />

      <Box
        component="main"
        sx={{
          p: { xs: 1, sm: 2 },
          flex: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      <CustomAlert />
    </Box>
  );
};

export default MainLayout;
