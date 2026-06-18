import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents, Message } from './interfaces';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
  // Явно указываем типы для сервера и клиента вместо any
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

  // Аргумент callback теперь строго принимает объект типа Message
  onNewMessage(callback: (message: Message) => void): void {
    this.socket?.on('newMessage', callback);
  }

  offNewMessage(): void {
    this.socket?.off('newMessage');
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
