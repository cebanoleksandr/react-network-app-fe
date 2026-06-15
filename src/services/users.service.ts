import { api } from './';
import type { User, UpdateProfileDto } from './interfaces';

export const UsersService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async getProfile(username: string): Promise<User> {
    const response = await api.get<User>(`/users/profile/${username}`);
    return response.data;
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  },
};
