export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface Media {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO';
}

export interface Post {
  id: string;
  caption: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  media: Media[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ToggleFollowResponse {
  followed: boolean;
  message: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
}
