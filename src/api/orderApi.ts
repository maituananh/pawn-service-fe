import {
    CheckoutRequest,
    CheckoutResponse,
    OrderDetailResponse,
    OrderParams,
    OrderStatusResponse,
    PaginatedOrderResponse
} from "@/type/order.type";
import axiosClient from "./axiosClient";

const orderApi = {
    checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
        const url = "/orders/checkout";
        const res = await axiosClient.post<CheckoutResponse>(url, data);
        return (res as any).data || res;
    },

    getOrderStatus: async (orderId: number): Promise<OrderStatusResponse> => {
        const url = `/orders/${orderId}/status`;
        const res = await axiosClient.get<OrderStatusResponse>(url);
        return (res as any).data || res;
    },

    getOrders: async (): Promise<OrderDetailResponse[]> => {
        const url = "/orders";
        const res = await axiosClient.get<OrderDetailResponse[]>(url);
        return (res as any).data || res;
    },

    getOrdersPaginated: async (params?: OrderParams): Promise<PaginatedOrderResponse> => {
        const url = "/orders";
        const res = await axiosClient.get<PaginatedOrderResponse>(url, { params });
        return (res as any).data || res;
    },

    getOrdersAdmin: async (params?: OrderParams): Promise<OrderDetailResponse[]> => {
        const url = "/admin/orders";
        const res = await axiosClient.get<any>(url, { params });
        return (res as any).data || res;
    },

    getOrdersAdminPaginated: async (params?: OrderParams): Promise<PaginatedOrderResponse> => {
        const url = "/admin/orders";
        const res = await axiosClient.get<PaginatedOrderResponse>(url, { params });
        return (res as any).data || res;
    },

    getOrderDetail: async (orderId: number): Promise<OrderDetailResponse> => {
        const url = `/orders/${orderId}`;
        const res = await axiosClient.get<OrderDetailResponse>(url);
        return (res as any).data || res;
    },

    cancelOrder: async (orderId: number) => {
        const url = `/orders/${orderId}/cancel`;
        return axiosClient.post(url);
    },

    getDashboardOrders: async (): Promise<{
        totalOrders: number;
        recentOrders: OrderDetailResponse[];
    }> => {
        const url = "/admin/orders/dashboard";
        const res = await axiosClient.get(url);
        return res?.data ?? res;
    }
};

export default orderApi;
