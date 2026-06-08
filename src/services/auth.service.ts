import { api, setAccessToken } from './';
import type { AuthResponse } from './interfaces';

export const AuthService = {
  async register(data: Record<string, string>): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  async login(data: Record<string, string>): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post<void>('/auth/logout');
    setAccessToken(null);
  },
};
