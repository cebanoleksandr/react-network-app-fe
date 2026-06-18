import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents, Message } from './interfaces';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
  }

  joinChat(chatId: string): void {
    this.socket?.emit('joinChat', { chatId });
  }

  sendMessage(chatId: string, senderId: string, content: string): void {
    this.socket?.emit('sendMessage', { chatId, senderId, content });
  }

  // --- ИЗМЕНЕНО: теперь методы принимают конкретный callback ---
  onNewMessage(callback: (message: Message) => void): void {
    this.socket?.on('newMessage', callback);
  }

  offNewMessage(callback: (message: Message) => void): void {
    this.socket?.off('newMessage', callback);
  }

  onMessagesRead(callback: (data: { chatId: string; readerId: string }) => void): void {
    this.socket?.on('messagesRead', callback);
  }

  offMessagesRead(callback: (data: { chatId: string; readerId: string }) => void): void {
    this.socket?.off('messagesRead', callback);
  }
  // -------------------------------------------------------------

  sendTyping(chatId: string, username: string) {
    this.socket?.emit('typing', { chatId, username });
  }

  sendStopTyping(chatId: string, username: string) {
    this.socket?.emit('stopTyping', { chatId, username });
  }

  onUserTyping(callback: (data: { chatId: string; username: string; isTyping: boolean }) => void) {
    this.socket?.on('userTyping', callback);
  }

  markAsRead(chatId: string, userId: string): void {
    this.socket?.emit('readMessages', { chatId, userId });
  }

  joinInbox(userId: string): void {
    this.socket?.emit('joinInbox', { userId });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
