import axiosClient from './axiosClient';

export interface ChatRequest {
  content: string;
  fileUrl?: string;
}

export interface OrderBrief {
  orderId: number;
  status: string;
  totalAmount: string;
  createdAt: string;
}

export interface ChatResponse {
  result: string;
  type?: string;
  username?: string;
  password?: string;
  name?: string;
  age?: number;
  email?: string;
  cardId?: string;
  phone?: string;
  address?: string;
  gender?: string;
  orders?: OrderBrief[];
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
