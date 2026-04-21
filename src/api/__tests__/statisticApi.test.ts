import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "../axiosClient";
import statisticApi from "../statisticApi";

// Mock axiosClient
vi.mock("../axiosClient", () => {
    const mockClient = {
        get: vi.fn()
    };
    return {
        default: mockClient
    };
});

describe("statisticApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getStatistics calls /dashboard/statistic", async () => {
        const mockData = { totalUsers: 10, totalOrders: 5 };
        (axiosClient.get as any).mockResolvedValue({ data: mockData });

        const result = await statisticApi.getStatistics();

        expect(axiosClient.get).toHaveBeenCalledWith("/dashboard/statistic");
        expect(result).toEqual(mockData);
    });
});
