import axios from 'axios';
import { api } from '.';

interface IUploadUrlResponse {
  uploadUrl: string;
  path: string;
  publicUrl: string;
}

export const MediaService = {
  async getUploadUrl(fileName: string, fileType: string): Promise<IUploadUrlResponse> {
    const response = await api.post<IUploadUrlResponse>('/media/upload-url', {
      fileName,
      fileType,
    });
    return response.data;
  },

  async uploadToStorage(uploadUrl: string, file: File): Promise<void> {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },
};
