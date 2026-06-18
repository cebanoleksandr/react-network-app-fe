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
  commentsCount: number;
  isLiked: boolean;
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
  bio?: string;
}

export class RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class LoginCredentials {
  email: string;
  password: string;
}

export interface ToggleBookmarkResponse {
  bookmarked: boolean;
  message: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  path: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  message: string;
}

export interface GetLikesResponse {
  count: number;
  likes: Like[];
}

export interface Like {
  id: string;
  user: User;
  post: Post;
  createdAt: Date;
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
