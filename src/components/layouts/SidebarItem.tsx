import { Typography, alpha, Box } from "@mui/material";
import type { ISidebarItem } from "./types";
import type { FC } from "react";
import { NavLink } from "react-router-dom";

interface IProps {
  menuItem: ISidebarItem;
}

const SidebarItem: FC<IProps> = ({ menuItem }) => {
  const { icon: Icon } = menuItem;

  return (
    <Box
      component={NavLink}
      to={menuItem.path}
      end={menuItem.end}
      sx={{
        textDecoration: "none",
        color: "#4A76A8",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 12px",
        marginBottom: "4px",
        borderRadius: "6px",
        transition: "all 0.2s ease-in-out",
        "& .MuiSvgIcon-root": {
          fontSize: "20px",
          color: alpha("#4A76A8", 0.8),
          transition: "color 0.2s",
        },

        "&:hover": {
          backgroundColor: alpha("#4A76A8", 0.05),
          color: "#2C5380",
          "& .MuiSvgIcon-root": {
            color: "#2C5380",
          }
        },

        "&.active": {
          backgroundColor: alpha("#4A76A8", 0.12),
          color: "#4A76A8",
          fontWeight: 700,
          "& .MuiSvgIcon-root": {
            color: "#4A76A8",
          },
          
          "&:hover": {
            backgroundColor: alpha("#4A76A8", 0.2),
          }
        },
      }}
    >
      <Icon />

      <Typography sx={{ fontSize: "14px", fontWeight: "inherit" }}>
        {menuItem.label}
      </Typography>
    </Box>
  );
};

export default SidebarItem;