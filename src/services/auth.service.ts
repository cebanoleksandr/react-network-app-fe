import { api } from './';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from './interfaces';

export const AuthService = {
  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post<void>('/auth/logout');
  },
};
