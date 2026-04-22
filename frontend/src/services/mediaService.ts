import api from './api';
import type { ApiResponse } from '@/types';

export interface MediaResponse {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  referenceType?: string;
  referenceId?: number;
  isPrimary: boolean;
}

export const mediaService = {
  /**
   * Upload a single file with category
   */
  uploadFile: async (
    file: File,
    category: string,
    referenceType?: string,
    referenceId?: number,
    isPrimary?: boolean
  ): Promise<MediaResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    if (referenceType) formData.append('referenceType', referenceType);
    if (referenceId) formData.append('referenceId', referenceId.toString());
    if (isPrimary !== undefined) formData.append('isPrimary', isPrimary.toString());

    const response = await api.post<ApiResponse<MediaResponse>>('/v1/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data!;
  },

  /**
   * Upload multiple files
   */
  uploadMultipleFiles: async (
    files: File[],
    category: string,
    referenceType?: string,
    referenceId?: number
  ): Promise<MediaResponse[]> => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('category', category);
    
    if (referenceType) formData.append('referenceType', referenceType);
    if (referenceId) formData.append('referenceId', referenceId.toString());

    const response = await api.post<ApiResponse<MediaResponse[]>>('/v1/media/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data!;
  },

  /**
   * Delete a media file
   */
  deleteFile: async (fileId: number): Promise<void> => {
    await api.delete(`/v1/media/${fileId}`);
  },

  /**
   * Get file URL (if needed separately)
   */
  getFileUrl: async (fileId: number): Promise<string> => {
    const response = await api.get<ApiResponse<{ url: string }>>(`/v1/media/${fileId}/url`);
    return response.data.data!.url;
  },
};

export default mediaService;
