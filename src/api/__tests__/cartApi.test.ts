import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "../axiosClient";
import cartApi from "../cartApi";

// Mock axiosClient
vi.mock("../axiosClient", () => {
    const mockClient = {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn()
    };
    return {
        default: mockClient
    };
});

describe("cartApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getMyCart calls /carts with GET", async () => {
        const mockCart = { items: [] };
        (axiosClient.get as any).mockResolvedValue({ data: mockCart });

        const result = await cartApi.getMyCart();

        expect(axiosClient.get).toHaveBeenCalledWith("/carts");
        expect(result).toEqual(mockCart);
    });

    it("addToCart calls /carts with POST and payload", async () => {
        const payload = { productId: 1, quantity: 2 };
        const mockResponse = { success: true };
        (axiosClient.post as any).mockResolvedValue({ data: mockResponse });

        const result = await cartApi.addToCart(payload);

        expect(axiosClient.post).toHaveBeenCalledWith("/carts", payload);
        expect(result).toEqual(mockResponse);
    });

    it("removeItem calls /carts with DELETE and productIds array", async () => {
        const productIds = [1, 2];
        (axiosClient.delete as any).mockResolvedValue({});

        await cartApi.removeItem(productIds);

        expect(axiosClient.delete).toHaveBeenCalledWith("/carts", { data: productIds });
    });
});
