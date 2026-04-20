import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "../axiosClient";
import usersApi from "../usersApi";

// Mock axiosClient
vi.mock("../axiosClient", () => {
    const mockClient = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn()
    };
    return {
        default: mockClient
    };
});

describe("usersApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getAll calls /users and maps cardId", async () => {
        const mockUsers = [{ id: 1, card_id: "CARD123" }];
        (axiosClient.get as any).mockResolvedValue({ data: mockUsers });

        const result = await usersApi.getAll();

        expect(axiosClient.get).toHaveBeenCalledWith("/users");
        expect(result[0].cardId).toBe("CARD123");
    });

    it("getById calls /users/:id and maps cardId", async () => {
        const mockUser = { id: 1, card_id: "CARD123" };
        (axiosClient.get as any).mockResolvedValue({ data: mockUser });

        const result = await usersApi.getById(1);

        expect(axiosClient.get).toHaveBeenCalledWith("/users/1");
        expect(result.cardId).toBe("CARD123");
    });

    it("getById throws error if data is missing", async () => {
        (axiosClient.get as any).mockResolvedValue({ data: null });

        await expect(usersApi.getById(1)).rejects.toThrow("User not found");
    });

    it("uploadAvatar calls /users/avatar with FormData", async () => {
        const mockFile = new File(["test"], "test.png", { type: "image/png" });
        (axiosClient.post as any).mockResolvedValue({ data: { url: "path/to/img" } });

        const result = await usersApi.uploadAvatar(mockFile);

        expect(axiosClient.post).toHaveBeenCalledWith(
            "/users/avatar",
            expect.any(FormData),
            expect.objectContaining({
                headers: { "Content-Type": "multipart/form-data" }
            })
        );
        expect(result.url).toBe("path/to/img");
    });

    it("update calls /users/:id with mapped payload", async () => {
        const payload = { fullName: "Test User", cardId: "NEWCARD" };
        (axiosClient.put as any).mockResolvedValue({ data: { success: true } });

        await usersApi.update(1, payload);

        expect(axiosClient.put).toHaveBeenCalledWith(
            "/users/1",
            expect.objectContaining({
                fullName: "Test User",
                card_id: "NEWCARD"
            })
        );
    });
});
