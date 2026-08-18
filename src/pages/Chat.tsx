import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Avatar, 
  TextField, 
  InputAdornment,
  CircularProgress,
  alpha
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done'; 
import DoneAllIcon from '@mui/icons-material/DoneAll'; 
import { ChatsService } from '../services/chats.service';
import { socketService } from '../services/socket';
import type { Message, ChatRoom } from '../services/interfaces';
import { useAppSelector } from '../store/hooks';

export const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isRecipientTyping, setIsRecipientTyping] = useState<boolean>(false);

  const { item: currentUser } = useAppSelector((state) => state.user);
  const token = localStorage.getItem('network-token') || ''; 

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!chatId || !currentUser) return;

    socketService.connect(token);
    socketService.joinChat(chatId);

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);

      if (newMessage.sender.id !== currentUser.id) {
        socketService.markAsRead(chatId, currentUser.id);
      }
    };

    const handleMessagesRead = (data: { chatId: string; readerId: string }) => {
      if (data.chatId === chatId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender.id !== data.readerId ? { ...msg, isRead: true } : msg
          )
        );
      }
    };

    const handleTypingEvent = (data: { chatId: string; username: string; isTyping: boolean }) => {
      if (data.chatId === chatId) {
        setIsRecipientTyping(data.isTyping);
      }
    };

    Promise.all([
      ChatsService.getChatMessages(chatId),
      ChatsService.getUserRooms()
    ])
      .then(([messagesData, roomsData]: [Message[], ChatRoom[]]) => {
        setMessages(messagesData);
        const currentRoom = roomsData.find(r => r.id === chatId);
        if (currentRoom) setRoomInfo(currentRoom);

        socketService.markAsRead(chatId, currentUser.id);
      })
      .catch((err: unknown) => {
        console.error('Error initialization chat data', err);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(scrollToBottom, 50);
      });

    socketService.onNewMessage(handleNewMessage);
    socketService.socket?.on('messagesRead', handleMessagesRead);
    socketService.onUserTyping(handleTypingEvent);

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.socket?.off('messagesRead', handleMessagesRead);
      if (socketService.socket) {
        socketService.socket.off('userTyping', handleTypingEvent);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setLoading(true); 
    };
  }, [chatId, token, currentUser]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);

    if (!chatId || !currentUser) return;

    if (value.trim().length > 0) {
      socketService.sendTyping(chatId, currentUser.username);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendStopTyping(chatId, currentUser.username);
      }, 2000);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketService.sendStopTyping(chatId, currentUser.username);
    }
  };

  const handleSend = (): void => {
    if (!text.trim() || !chatId || !currentUser) return;
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketService.sendStopTyping(chatId, currentUser.username);

    socketService.sendMessage(chatId, currentUser.id, text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={30} sx={{ color: '#2688eb' }} />
      </Box>
    );
  }

  const recipient = roomInfo?.participants.find(p => p.id !== currentUser?.id) || roomInfo?.participants[0];
  const recipientName = recipient ? `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || recipient.username : 'Chat';

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', padding: '16px', height: 'calc(100vh - 100px)' }}>
      <Paper 
        elevation={0} 
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ebedf0'
        })}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`
          })}
        >
          <IconButton onClick={() => navigate('/app/dialogs')} sx={(theme) => ({ color: theme.palette.mode === 'dark' ? '#8FB8E0' : '#2a5885', mr: 1 })}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar src={recipient?.avatarUrl || undefined} sx={{ width: 36, height: 36, mr: 1.5 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {recipientName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isRecipientTyping ? '#2688eb' : 'text.secondary',
                fontWeight: isRecipientTyping ? 500 : 400
              }}
            >
              {isRecipientTyping ? 'typing...' : 'online'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          scrollbarWidth: "thin" 
        }}>
          {messages.map((msg: Message) => {
            const isMe = msg.sender.id === currentUser?.id;
            return (
              <Box 
                key={msg.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  gap: '8px',
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                {!isMe && <Avatar src={msg.sender.avatarUrl || undefined} sx={{ width: 32, height: 32 }} />}
                <Box
                  sx={(theme) => ({
                    backgroundColor: isMe
                      ? (theme.palette.mode === 'dark' ? alpha('#2688eb', 0.25) : '#e2f0ff')
                      : theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    padding: '8px 12px',
                    borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    border: isMe
                      ? `1px solid ${theme.palette.mode === 'dark' ? alpha('#2688eb', 0.4) : '#cce4ff'}`
                      : `1px solid ${theme.palette.divider}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  })}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: '1.4', wordBreak: 'break-word' }}>
                    {msg.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5, mb: -0.5, gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    {isMe && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {msg.isRead ? (
                          <DoneAllIcon sx={{ fontSize: '14px', color: '#2688eb' }} />
                        ) : (
                          <DoneIcon sx={{ fontSize: '14px', color: 'text.disabled' }} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={(theme) => ({ padding: '12px', backgroundColor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}` })}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Напишіть повідомлення..."
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleSend} 
                      disabled={!text.trim()}
                      sx={{ color: text.trim() ? '#2688eb' : 'text.disabled' }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { padding: '4px 8px', fontSize: '0.9rem' }
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;
