import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import CustomAlert from "../UI/CustomAlert";

const AuthLayout = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Outlet />
      <CustomAlert />
    </Box>
  );
};

export default AuthLayout;
