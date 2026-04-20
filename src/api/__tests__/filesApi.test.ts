import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "../axiosClient";
import filesApi from "../filesApi";

// Mock axiosClient
vi.mock("../axiosClient", () => {
    const mockClient = {
        post: vi.fn()
    };
    return {
        default: mockClient
    };
});

describe("filesApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("upload calls /files/upload with FormData", async () => {
        const mockFile = new File(["foo"], "foo.txt", { type: "text/plain" });
        const mockResponse = { url: "http://example.com/foo.txt" };
        (axiosClient.post as any).mockResolvedValue({ data: mockResponse });

        const result = await filesApi.upload(mockFile);

        expect(axiosClient.post).toHaveBeenCalledWith(
            "/files/upload",
            expect.any(FormData),
            expect.objectContaining({
                headers: { "Content-Type": "multipart/form-data" }
            })
        );
        expect(result).toEqual(mockResponse);
    });
});
