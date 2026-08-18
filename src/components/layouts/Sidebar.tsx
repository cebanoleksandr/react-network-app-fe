import { useEffect, useState, useCallback } from "react";
import { Box, Drawer } from "@mui/material";
import { 
  AccountCircle, 
  RssFeed, 
  Chat, 
  People, 
  Group,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { ISidebarItem } from "./types";
import SidebarItem from "./SidebarItem";
import { useAppSelector } from "../../store/hooks";
import { ChatsService } from "../../services/chats.service";
import { socketService } from "../../services/socket";
import type { ChatRoom, Message } from "../../services/interfaces";

interface IProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({ mobileOpen = false, onMobileClose }: IProps) => {
  const { t } = useTranslation();
  const { item: currentUser } = useAppSelector(state => state.user);
  const token = localStorage.getItem('network-token') || '';

  const [totalUnread, setTotalUnread] = useState<number>(0);

  const fetchUnreadCount = useCallback(() => {
    if (!currentUser) return;
    
    ChatsService.getUserRooms()
      .then((rooms: ChatRoom[]) => {
        const sum = rooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0);
        setTotalUnread(sum);
      })
      .catch((err: unknown) => {
        console.error("Error updating sidebar badge:", err);
      });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    socketService.connect(token);

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.sender.id !== currentUser.id) {
        fetchUnreadCount();
      }
    };

    const handleReadEvent = (data: { chatId: string; readerId: string }) => {
      if (data.readerId === currentUser.id) {
        setTimeout(fetchUnreadCount, 150);
      }
    };

    const setupSocketListeners = () => {
      socketService.joinInbox(currentUser.id);
      socketService.onNewMessage(handleNewMessage);
      socketService.socket?.on('messagesRead', handleReadEvent);
    };

    if (socketService.socket?.connected) {
      setupSocketListeners();
    } else {
      socketService.socket?.on('connect', setupSocketListeners);
    }

    fetchUnreadCount();

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.socket?.off('messagesRead', handleReadEvent);
      socketService.socket?.off('connect', setupSocketListeners);
    };
  }, [token, currentUser, fetchUnreadCount]);

  const menuItems: ISidebarItem[] = [
    { label: t("sidebar.profile"), path: `/app/profile/${currentUser?.id}`, icon: AccountCircle },
    { label: t("sidebar.feed"), path: "/app", end: true, icon: RssFeed },
    { label: t("sidebar.dialogs"), path: "/app/dialogs", icon: Chat, badge: totalUnread },
    { label: t("sidebar.people"), path: "/app/people", icon: People },
    { label: t("sidebar.groups"), path: "/app/groups", icon: Group },
    // { label: t("sidebar.photos"), path: "/app/photos", icon: PhotoCamera },
    // { label: t("sidebar.music"), path: "/app/music", icon: MusicNote },
    // { label: t("sidebar.video"), path: "/app/video", icon: VideoLibrary },
    // { label: t("sidebar.games"), path: "/app/games", icon: SportsEsports },
  ];

  const menuContent = (
    <>
      {menuItems.map((item) => (
        <SidebarItem key={item.path} menuItem={item} />
      ))}

      <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }}></Box>

      <SidebarItem menuItem={{ label: t("sidebar.settings"), path: "/app/settings", icon: SettingsIcon }} />
    </>
  );

  return (
    <>
      <Box
        sx={{
          width: 200,
          flexShrink: 0,
          position: "sticky",
          top: '76px',
          maxHeight: 'calc(100vh - 92px)',
          overflowY: 'auto',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {menuContent}
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', p: 2 },
        }}
      >
        <Box onClick={onMobileClose}>
          {menuContent}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
