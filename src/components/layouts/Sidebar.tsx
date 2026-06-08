import { Box } from "@mui/material";
import type { ISidebarItem } from "./types";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const menuItems: ISidebarItem[] = [
    { label: "Profile", path: "/app/profile" },
    { label: "Feed", path: "/app", end: true },
    { label: "Dialogs", path: "/app/dialogs" },
    { label: "People", path: "/app/people" },
    { label: "Groups", path: "/app/groups" },
    { label: "Photos", path: "/app/photos" },
    { label: "Music", path: "/app/music" },
    { label: "Video", path: "/app/video" },
    { label: "Games", path: "/app/games" },
  ];

  return (
    <Box
      sx={{
        width: 200,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
      }}
    >
      {menuItems.map((item) => (
        <SidebarItem key={item.path} menuItem={item} />
      ))}
    </Box>
  );
};

export default Sidebar;
