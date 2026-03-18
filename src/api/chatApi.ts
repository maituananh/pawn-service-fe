import axiosClient from "./axiosClient";

export interface ChatRequest {
  content: string;
  fileUrl?: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  error: string | null;
  meta?: {
    sessionId: string;
    responseTime: number;
    [key: string]: any;
  };
}

export interface OrderBrief {
  orderId: number;
  status: string;
  totalAmount: string;
  createdAt: string;
}

export interface ProfileResult {
  username?: string;
  name?: string;
  age?: number;
  email?: string;
  cardId?: string;
  phone?: string;
  address?: string;
  gender?: string;
  avatar?: string;
}

export interface OrderResult {
  message?: string;
  orders: OrderBrief[];
}

export interface CreateAccountResult {
  missingFields?: string[];
  username?: string;
  password?: string;
}

export interface ChatResponse {
  reply: string;
  intent: string;
  step: number;
  stepTotal: number;
  collectingField: string | null;
  result: ProfileResult | OrderResult | CreateAccountResult | any;
  messages: any[];
  complete: boolean;
}

export interface HistoryItem {
  userMessage: string;
  aiResponse: ApiResponse<ChatResponse>;
  timestamp: string;
}

const chatApi = {
  async sendMessage(payload: ChatRequest): Promise<ChatResponse> {
    const res = await axiosClient.post<ApiResponse<ChatResponse>>(
      "/chat",
      payload,
    );
    return res.data.data;
  },
  async getHistory(): Promise<HistoryItem[]> {
    const res = await axiosClient.get<HistoryItem[]>("/chat/history");
    // axiosClient returns res.data which is the array
    return (res as any).data || res;
  },
};

export default chatApi;
