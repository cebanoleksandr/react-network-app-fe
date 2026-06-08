import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default LandingLayout;
