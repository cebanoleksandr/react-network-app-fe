import { api } from './';
import type { User, UpdateProfileDto, ToggleFollowResponse, GetAllUsersParams, PaginatedUsersResponse } from './interfaces';

export const UsersService = {
  async getAllUsers(params?: GetAllUsersParams): Promise<PaginatedUsersResponse> {
    const response = await api.get<PaginatedUsersResponse>('/users', { params });
    return response.data;
  },

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

  async getFollowers(userId: string): Promise<User[]> {
    const response = await api.get<User[]>(`/users/${userId}/followers`);
    return response.data;
  },
  
  async getFollowing(userId: string): Promise<User[]> {
    const response = await api.get<User[]>(`/users/${userId}/following`);
    return response.data;
  },

  async toggleFollow(userId: string): Promise<ToggleFollowResponse> {
    const response = await api.post<ToggleFollowResponse>(`/users/${userId}/follow`);
    return response.data;
  },
};
