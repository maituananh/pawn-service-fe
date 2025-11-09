import axiosClient from './axiosClient';

export interface UploadResponse {
  url: string;
  id?: number;
}

const filesApi = {
  async upload(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosClient.post<UploadResponse>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },
};

export default filesApi;