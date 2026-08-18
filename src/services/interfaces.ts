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
  type: MediaType;
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
  isBookmarked: boolean;
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
  avatarUrl?: string;
}

export class RegisterCredentials {
  email?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export class LoginCredentials {
  email?: string;
  password?: string;
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

export interface ChatRoom {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  unreadCount?: number;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      username: string;
    };
  } | null;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  isDelivered: boolean; 
  isRead: boolean;
  chatId: string;
}

export interface CreateChatResponse {
  id: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
}

export interface ServerToClientEvents {
  newMessage: (message: Message) => void;
  userTyping: (data: { chatId: string; username: string; isTyping: boolean }) => void;
  messagesRead: (data: { chatId: string; readerId: string }) => void;
}

export interface ClientToServerEvents {
  joinChat: (data: { chatId: string }) => void;
  sendMessage: (data: { chatId: string; senderId: string; content: string }) => void;
  typing: (data: { chatId: string; username: string }) => void;
  stopTyping: (data: { chatId: string; username: string }) => void;
  readMessages: (data: { chatId: string; userId: string }) => void;
  joinInbox: (data: { userId: string }) => void;
}

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export interface IStory {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
  createdAt: string;
  expiresAt: string;
  user: User;
  views: User[];
}

export interface ICreateStoryDto {
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
}

export const GroupRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  MEMBER: 'MEMBER',
} as const;

export type GroupRoleType = typeof GroupRole[keyof typeof GroupRole];

export interface IGroupMember {
  id: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
  };
  role: GroupRoleType;
  joinedAt: string;
}

export interface IGroup {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  slug: string;
  isPrivate: boolean;
  owner: {
    id: string;
    username: string;
  };
  members: IGroupMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateGroupDto {
  name: string;
  description?: string;
  slug: string;
  isPrivate?: boolean;
}

export interface IUpdateGroupDto {
  name?: string;
  description?: string;
  slug?: string;
  isPrivate?: boolean;
  avatarUrl?: string;
}
