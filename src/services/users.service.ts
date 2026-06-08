import { api } from './';
import type { User, UpdateProfileDto } from './interfaces';

export const UsersService = {
  async getProfile(username: string): Promise<User> {
    const response = await api.get<User>(`/users/profile/${username}`);
    return response.data;
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  },
};