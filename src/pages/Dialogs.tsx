import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Divider, 
  Paper,
  CircularProgress,
  Badge 
} from '@mui/material';
import { ChatsService } from '../services/chats.service';
import { socketService } from '../services/socket';
import type { ChatRoom, Message } from '../services/interfaces';
import { useAppSelector } from '../store/hooks';

export const Dialogs: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { item: currentUser } = useAppSelector((state) => state.user);
  const token = localStorage.getItem('network-token') || ''; 

  useEffect(() => {
    if (!currentUser) return;

    socketService.connect(token);

    const handleNewMessage = (newMessage: Message) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id === newMessage.chatId) {
            const isFromMe = newMessage.sender.id === currentUser.id;
            return {
              ...room,
              unreadCount: isFromMe ? room.unreadCount : (room.unreadCount || 0) + 1,
              lastMessage: {
                id: newMessage.id,
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                sender: {
                  id: newMessage.sender.id,
                  username: newMessage.sender.username,
                }
              }
            };
          }
          return room;
        })
      );
    };

    const setupSocketListeners = () => {
      socketService.joinInbox(currentUser.id);
      socketService.onNewMessage(handleNewMessage);
    };

    if (socketService.socket?.connected) {
      setupSocketListeners();
    } else {
      socketService.socket?.on('connect', setupSocketListeners);
    }

    ChatsService.getUserRooms()
      .then((data: ChatRoom[]) => {
        setRooms(data);
        data.forEach((room) => {
          socketService.joinChat(room.id);
        });
      })
      .catch((err: unknown) => console.error('Failed to load chat rooms', err))
      .finally(() => setLoading(false));

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.socket?.off('connect', setupSocketListeners);
    };
  }, [token, currentUser]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress size={30} sx={{ color: '#2688eb' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
      <Paper elevation={0} sx={{ border: '1px solid #e7e8ec', borderRadius: '8px', overflow: 'hidden' }}>
        <Box sx={{ padding: '12px 16px', borderBottom: '1px solid #e7e8ec', backgroundColor: '#fff' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000' }}>Мессенджер</Typography>
        </Box>

        <List sx={{ padding: 0, backgroundColor: '#fff' }}>
          {rooms.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: '#818c99' }}>
              <Typography variant="body2">У вас поки немає активних діалогів</Typography>
            </Box>
          ) : (
            rooms.map((room: ChatRoom, index: number) => {
              const recipient = room.participants.find(p => p.id !== currentUser?.id) || room.participants[0];
              const fullName = `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || recipient.username;
              const isLastMessageFromMe = room.lastMessage?.sender.id === currentUser?.id;

              return (
                <React.Fragment key={room.id}>
                  <ListItem onClick={() => navigate(`/app/chat/${room.id}`)} sx={{ padding: '12px 16px', cursor: 'pointer', '&:hover': { backgroundColor: '#f5f6f8' }, transition: 'background-color 0.1s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
                      <ListItemAvatar sx={{ minWidth: '60px' }}>
                        <Avatar src={recipient.avatarUrl} alt={fullName} sx={{ width: 48, height: 48 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: 500, color: '#2a5885', fontSize: '0.9rem' }}>{fullName}</Typography>}
                        secondary={
                          <Typography variant="body2" sx={{ color: '#656565', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', gap: '4px' }}>
                            {room.lastMessage ? (
                              <>
                                {isLastMessageFromMe && <Box component="span" sx={{ color: '#818c99', fontWeight: 500 }}>Ви:</Box>}
                                <Box component="span" sx={{ color: isLastMessageFromMe ? '#555' : '#000' }}>{room.lastMessage.content}</Box>
                              </>
                            ) : (
                              <Box component="span" sx={{ color: '#818c99' }}>Повідомлень немає</Box>
                            )}
                          </Typography>
                        }
                        sx={{ minWidth: 0, pr: 2 }}
                      />
                    </Box>
                    {room.unreadCount && room.unreadCount > 0 ? (
                      <Badge badgeContent={room.unreadCount} max={99} sx={{ '& .MuiBadge-badge': { backgroundColor: '#e2f0ff', color: '#2688eb', fontWeight: 600, fontSize: '11px', height: '20px', minWidth: '20px', borderRadius: '10px', position: 'static', transform: 'none', px: 1 } }} />
                    ) : null}
                  </ListItem>
                  {index < rooms.length - 1 && <Divider component="li" sx={{ borderColor: '#eff1f3', marginLeft: '76px' }} />}
                </React.Fragment>
              );
            })
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Dialogs;
