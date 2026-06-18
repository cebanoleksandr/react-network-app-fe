import { api } from './';
import type { ChatRoom, Message, CreateChatResponse } from './interfaces';

export const ChatsService = {
  async getUserRooms(): Promise<ChatRoom[]> {
    const response = await api.get<ChatRoom[]>('/chat/rooms');
    return response.data;
  },

  async getOrCreateRoom(recipientId: string): Promise<CreateChatResponse> {
    const response = await api.post<CreateChatResponse>('/chat/room', { recipientId });
    return response.data;
  },

  async getChatMessages(chatId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/chat/room/${chatId}/messages`);
    return response.data;
  },
};
