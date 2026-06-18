import { Box } from "@mui/material";
import { 
  AccountCircle, 
  RssFeed, 
  Chat, 
  People, 
  Group, 
  PhotoCamera, 
  MusicNote, 
  VideoLibrary, 
  SportsEsports,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { ISidebarItem } from "./types";
import SidebarItem from "./SidebarItem";
import { useAppSelector } from "../../store/hooks";

const Sidebar = () => {
  const { t } = useTranslation();
  const { item: currentUser } = useAppSelector(state => state.user);

  const menuItems: ISidebarItem[] = [
    { label: t("sidebar.profile"), path: `/app/profile/${currentUser?.id}`, icon: AccountCircle },
    { label: t("sidebar.feed"), path: "/app", end: true, icon: RssFeed },
    { label: t("sidebar.dialogs"), path: "/app/dialogs", icon: Chat },
    { label: t("sidebar.people"), path: "/app/people", icon: People },
    { label: t("sidebar.groups"), path: "/app/groups", icon: Group },
    { label: t("sidebar.photos"), path: "/app/photos", icon: PhotoCamera },
    { label: t("sidebar.music"), path: "/app/music", icon: MusicNote },
    { label: t("sidebar.video"), path: "/app/video", icon: VideoLibrary },
    { label: t("sidebar.games"), path: "/app/games", icon: SportsEsports },
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

      <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }}></Box>

      <SidebarItem menuItem={{ label: t("sidebar.settings"), path: "/app/settings", icon: SettingsIcon }} />
    </Box>
  );
};

export default Sidebar;
