import categoriesApi from "@/api/categoriesApi";
import productsApi from "@/api/productsApi";
import { Page } from "@/type/page.type";
import { Product } from "@/type/product.type";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsPage from "../ProductsPage";

// Mock APIs
vi.mock("@/api/productsApi", () => ({
    default: {
        getAll: vi.fn(),
        search: vi.fn()
    }
}));
vi.mock("@/api/categoriesApi", () => ({
    default: {
        getAll: vi.fn()
    }
}));

describe("ProductsPage Integration", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false }
            }
        });
    });

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>{ui}</BrowserRouter>
            </QueryClientProvider>
        );
    };

    it("renders products and categories", async () => {
        const mockCategories = [{ id: 1, name: "Gold" }];
        const mockProducts = {
            data: [{ id: 1, name: "Gold Ring", price: 5000000, category: { name: "Gold" }, status: "LIQUIDATION" }],
            totalElements: 1
        };

        vi.mocked(categoriesApi.getAll).mockResolvedValue(mockCategories);
        vi.mocked(productsApi.search).mockResolvedValue(mockProducts as Page<Product>);

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            // "Gold" appears in category list and product card category chip
            expect(screen.getAllByText("Gold").length).toBeGreaterThanOrEqual(1);
            expect(screen.getByText("Gold Ring")).toBeInTheDocument();
            expect(screen.getByText(/5.000.000/)).toBeInTheDocument();
        });
    });

    it("filters products by search text", async () => {
        vi.mocked(categoriesApi.getAll).mockResolvedValue([]);
        vi.mocked(productsApi.search).mockResolvedValue({ data: [], totalElements: 0 } as Page<Product>);

        renderWithProviders(<ProductsPage />);

        const searchInput = screen.getByPlaceholderText("Tên sản phẩm...");

        await act(async () => {
            fireEvent.change(searchInput, { target: { value: "Laptop" } });
        });

        await waitFor(() => {
            expect(productsApi.search).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Laptop"
                })
            );
        });
    });

    it("shows empty state when no products found", async () => {
        vi.mocked(categoriesApi.getAll).mockResolvedValue([]);
        vi.mocked(productsApi.search).mockResolvedValue({ data: [], totalElements: 0 } as Page<Product>);

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText("Không tìm thấy sản phẩm nào")).toBeInTheDocument();
        });
    });
});
