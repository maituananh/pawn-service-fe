import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "../axiosClient";
import categoriesApi from "../categoriesApi";

// Mock axiosClient
vi.mock("../axiosClient", () => {
    const mockClient = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    };
    return {
        default: mockClient
    };
});

describe("categoriesApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getAll calls /categories", async () => {
        const mockCategories = [{ id: 1, name: "Gold" }];
        (axiosClient.get as any).mockResolvedValue({ data: mockCategories });

        const result = await categoriesApi.getAll();

        expect(axiosClient.get).toHaveBeenCalledWith("/categories");
        expect(result).toEqual(mockCategories);
    });

    it("getAll returns empty array if data is null", async () => {
        (axiosClient.get as any).mockResolvedValue({ data: null });

        const result = await categoriesApi.getAll();

        expect(axiosClient.get).toHaveBeenCalledWith("/categories");
        expect(result).toEqual([]);
    });

    it("getById calls /categories/:id", async () => {
        const mockCategory = { id: 1, name: "Gold" };
        (axiosClient.get as any).mockResolvedValue({ data: mockCategory });

        const result = await categoriesApi.getById(1);

        expect(axiosClient.get).toHaveBeenCalledWith("/categories/1");
        expect(result).toEqual(mockCategory);
    });

    it("create calls /categories with POST", async () => {
        const payload = { name: "New Category", description: "Desc" };
        const mockResponse = { id: 1, ...payload };
        (axiosClient.post as any).mockResolvedValue({ data: mockResponse });

        const result = await categoriesApi.create(payload as any);

        expect(axiosClient.post).toHaveBeenCalledWith("/categories", payload);
        expect(result).toEqual(mockResponse);
    });

    it("update calls /categories/:id with PUT", async () => {
        const payload = { name: "Updated Category" };
        const mockResponse = { id: 1, ...payload };
        (axiosClient.put as any).mockResolvedValue({ data: mockResponse });

        const result = await categoriesApi.update(1, payload as any);

        expect(axiosClient.put).toHaveBeenCalledWith("/categories/1", payload);
        expect(result).toEqual(mockResponse);
    });

    it("delete calls /categories/:id with DELETE", async () => {
        (axiosClient.delete as any).mockResolvedValue({});

        await categoriesApi.delete(1);

        expect(axiosClient.delete).toHaveBeenCalledWith("/categories/1");
    });
});
