import axios from 'axios';
import { api } from './';
import type { Comment, GetLikesResponse, PaginatedResponse, Post, ToggleBookmarkResponse, ToggleLikeResponse, UploadUrlResponse } from './interfaces';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const PostsService = {
  async getFeed(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>('/posts', {
      params: { page, limit },
    });
    return response.data;
  },

  async createPost(caption: string, files: File[]): Promise<Post> {
    let mediaData: { url: string; type: 'IMAGE' | 'VIDEO' | 'AUDIO' }[] = [];

    if (files.length > 0) {
      mediaData = await Promise.all(
        files.map(async (file) => {
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

          const publicUrl = `https://${supabaseUrl}.supabase.co/storage/v1/object/public/network/${path}`;

          let mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' = 'IMAGE';
          if (file.type.startsWith('video/')) mediaType = 'VIDEO';
          if (file.type.startsWith('audio/')) mediaType = 'AUDIO';

          return {
            url: publicUrl,
            type: mediaType,
          };
        })
      );
    }

    const postResponse = await api.post<Post>('/posts', {
      caption,
      media: mediaData,
    });

    return postResponse.data;
  },

  async toggleLike(postId: string): Promise<ToggleLikeResponse> {
    const response = await api.post<ToggleLikeResponse>(`/posts/${postId}/like`);
    return response.data;
  },

  async getLikes(postId: string): Promise<GetLikesResponse> {
    const response = await api.get<GetLikesResponse>(`/posts/${postId}/likes`);
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

  async toggleBookmark(postId: string): Promise<ToggleBookmarkResponse> {
    const response = await api.post<ToggleBookmarkResponse>(`/posts/${postId}/bookmark`);
    return response.data;
  },

  async getBookmarkedPosts(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>('/posts/bookmarked/all', {
      params: { page, limit },
    });
    return response.data;
  },
};
