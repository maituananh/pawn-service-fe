import axiosClient from './axiosClient';

export interface ChatRequest {
  content: string;
  fileUrl?: string;
}

export interface ChatResponse {
  result: string;
}

const chatApi = {
  async sendMessage(payload: ChatRequest): Promise<ChatResponse> {
    const { data } = await axiosClient.post<ChatResponse>('/chat', payload);
    return data;
  },
};

export default chatApi;
