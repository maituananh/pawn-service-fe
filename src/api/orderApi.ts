import {
  CheckoutRequest,
  CheckoutResponse,
  OrderDetailResponse,
  OrderStatusResponse,
} from '@/type/order.type';
import axiosClient from './axiosClient';

const orderApi = {
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const url = '/orders/checkout';
    const res = await axiosClient.post<CheckoutResponse>(url, data);
    return (res as any).data || res;
  },

  getOrderStatus: async (orderId: number): Promise<OrderStatusResponse> => {
    const url = `/orders/${orderId}/status`;
    const res = await axiosClient.get<OrderStatusResponse>(url);
    return (res as any).data || res;
  },

  getOrders: async (): Promise<OrderDetailResponse[]> => {
    const url = '/orders';
    const res = await axiosClient.get<OrderDetailResponse[]>(url);
    return (res as any).data || res;
  },

  getOrderDetail: async (orderId: number): Promise<OrderDetailResponse> => {
    const url = `/orders/${orderId}`;
    const res = await axiosClient.get<OrderDetailResponse>(url);
    return (res as any).data || res;
  },
};

export default orderApi;
