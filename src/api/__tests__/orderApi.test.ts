import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "../axiosClient";
import orderApi from "../orderApi";

// Mock axiosClient
vi.mock("../axiosClient", () => {
    const mockClient = {
        get: vi.fn(),
        post: vi.fn()
    };
    return {
        default: mockClient
    };
});

describe("orderApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("checkout calls /orders/checkout with POST", async () => {
        const payload = { address: "Hanoi", items: [1] };
        const mockResponse = { orderId: 123 };
        (axiosClient.post as any).mockResolvedValue({ data: mockResponse });

        const result = await orderApi.checkout(payload as any);

        expect(axiosClient.post).toHaveBeenCalledWith("/orders/checkout", payload);
        expect(result).toEqual(mockResponse);
    });

    it("getOrderStatus calls /orders/:id/status", async () => {
        const mockResponse = { status: "PENDING" };
        (axiosClient.get as any).mockResolvedValue({ data: mockResponse });

        const result = await orderApi.getOrderStatus(1);

        expect(axiosClient.get).toHaveBeenCalledWith("/orders/1/status");
        expect(result).toEqual(mockResponse);
    });

    it("getOrdersPaginated calls /orders with params", async () => {
        const params = { page: 0, size: 10 };
        const mockResponse = { content: [] };
        (axiosClient.get as any).mockResolvedValue({ data: mockResponse });

        const result = await orderApi.getOrdersPaginated(params as any);

        expect(axiosClient.get).toHaveBeenCalledWith("/orders", { params });
        expect(result).toEqual(mockResponse);
    });

    it("getOrdersAdmin calls /admin/orders", async () => {
        (axiosClient.get as any).mockResolvedValue({ data: [] });

        await orderApi.getOrdersAdmin();

        expect(axiosClient.get).toHaveBeenCalledWith("/admin/orders");
    });

    it("getOrderDetail calls /orders/:id", async () => {
        const mockResponse = { id: 1 };
        (axiosClient.get as any).mockResolvedValue({ data: mockResponse });

        const result = await orderApi.getOrderDetail(1);

        expect(axiosClient.get).toHaveBeenCalledWith("/orders/1");
        expect(result).toEqual(mockResponse);
    });

    it("cancelOrder calls /orders/:id/cancel with POST", async () => {
        (axiosClient.post as any).mockResolvedValue({});

        await orderApi.cancelOrder(1);

        expect(axiosClient.post).toHaveBeenCalledWith("/orders/1/cancel");
    });
});
