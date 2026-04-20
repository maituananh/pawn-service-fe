import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "../axiosClient";
import chatApi from "../chatApi";

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

describe("chatApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sendMessage calls /chat and returns data.data", async () => {
        const payload = { content: "Hello" };
        const mockResponse = {
            data: {
                data: { reply: "Hi there" }
            }
        };
        (axiosClient.post as any).mockResolvedValue(mockResponse);

        const result = await chatApi.sendMessage(payload);

        expect(axiosClient.post).toHaveBeenCalledWith("/chat", payload);
        expect(result.reply).toBe("Hi there");
    });

    it("getHistory calls /chat/history", async () => {
        const mockHistory = [{ userMessage: "test", aiResponse: {} }];
        (axiosClient.get as any).mockResolvedValue({ data: mockHistory });

        const result = await chatApi.getHistory();

        expect(axiosClient.get).toHaveBeenCalledWith("/chat/history");
        expect(result).toEqual(mockHistory);
    });
});
