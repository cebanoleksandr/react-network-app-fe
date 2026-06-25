import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CustomAlert from "../UI/CustomAlert";

const MainLayout = () => {
  return (
    <Box 
      sx={{ 
        height: "100vh", 
        bgcolor: '#EDEEF0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Header />

      <Box 
        component="main" 
        sx={{ 
          p: 2, 
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            height: '100%',
            maxWidth: "1200px", 
            mx: "auto", 
            position: "relative" 
          }}
        >
          <Sidebar />

          <Box 
            sx={{ 
              pl: '220px', 
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <CustomAlert />
    </Box>
  );
};

export default MainLayout;
