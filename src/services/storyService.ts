import axios from 'axios';
import { api } from './';
import { type MediaType, type IStory, type UploadUrlResponse } from './interfaces';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const StoriesService = {
  async getFeedStories(): Promise<IStory[]> {
    const response = await api.get<IStory[]>('/stories/feed');
    return response.data;
  },

  async createStory(file: File, caption = ''): Promise<IStory> {
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

    let mediaType: MediaType = 'IMAGE';
    if (file.type.startsWith('video/')) mediaType = 'VIDEO';
    if (file.type.startsWith('audio/')) mediaType = 'AUDIO';

    const response = await api.post<IStory>('/stories', {
      mediaUrl: publicUrl,
      mediaType: mediaType,
      caption,
    });

    return response.data;
  },

  async viewStory(storyId: string): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(`/stories/${storyId}/view`);
    return response.data;
  },
};
