import axiosClient from './axiosClient';

export interface ChatRequest {
  content: string;
  fileUrl?: string;
}

export interface ChatResponse {
  result: string;
  type?: string;
}

export interface OcrUserRequest {
  username?: string;
  phone?: string;
  email?: string;
  fileUrl?: string;
}

const chatApi = {
  async sendMessage(payload: ChatRequest): Promise<ChatResponse> {
    const { data } = await axiosClient.post<ChatResponse>('/chat', payload);
    return data;
  },
  async sendOcrUser(payload: OcrUserRequest): Promise<any> {
    const { data } = await axiosClient.post('/chat/ocr/user', payload);
    return data;
  },
};

export default chatApi;
