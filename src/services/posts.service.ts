import axios from 'axios';
import { api } from './';
import type { PaginatedResponse, Post, ToggleFollowResponse, User } from './interfaces';

interface UploadUrlResponse {
  uploadUrl: string;
  path: string;
}

interface ToggleLikeResponse {
  liked: boolean;
  message: string;
}

export const PostsService = {
  async getFeed(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>('/posts', {
      params: { page, limit },
    });
    return response.data;
  },

  async createPost(caption: string, file: File | null): Promise<Post> {
    let mediaData: { url: string; type: 'IMAGE' | 'VIDEO' }[] | null = null;

    if (file) {
      const urlResponse = await api.post<UploadUrlResponse>('/media/upload-url', {
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadUrl, path } = urlResponse.data;

      await axios.put<void>(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      const publicUrl = `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/storage/v1/object/public/social-media/${path}`;

      mediaData = [{
        url: publicUrl,
        type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
      }];
    }

    const postResponse = await api.post<Post>('/posts', {
      caption,
      media: mediaData || [],
    });

    return postResponse.data;
  },

  async toggleLike(postId: string): Promise<ToggleLikeResponse> {
    const response = await api.post<ToggleLikeResponse>(`/posts/${postId}/like`);
    return response.data;
  },

  async addComment(postId: string, text: string): Promise<Comment> {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, { text });
    return response.data;
  },

  async getComments(postId: string): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },

  async toggleFollow(userId: string): Promise<ToggleFollowResponse> {
    const response = await api.post<ToggleFollowResponse>(`/users/${userId}/follow`);
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
};
