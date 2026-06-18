import { Typography, alpha, Box, Badge } from "@mui/material";
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
        justifyContent: "space-between",
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
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <Icon />
        <Typography sx={{ fontSize: "14px", fontWeight: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {menuItem.label}
        </Typography>
      </Box>

      {menuItem.badge && menuItem.badge > 0 ? (
        <Badge
          badgeContent={menuItem.badge}
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#e2f0ff",
              color: "#2688eb",
              fontWeight: 600,
              fontSize: "11px",
              height: "18px",
              minWidth: "18px",
              borderRadius: "9px",
              position: "static",
              transform: "none",
              px: 0.8,
            }
          }}
        />
      ) : null}
    </Box>
  );
};

export default SidebarItem;
