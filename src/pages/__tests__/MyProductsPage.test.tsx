import { useMyProducts } from "@/hooks/useProducts";
import { Product } from "@/type/product.type";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MyProductsPage from "../MyProductsPage";

// Mock hooks
vi.mock("@/hooks/useProducts");
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe("MyProductsPage", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false }
            }
        });
    });

    const renderPage = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MyProductsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    };

    it("renders loading state correctly", () => {
        vi.mocked(useMyProducts).mockReturnValue({
            products: [],
            isLoading: true,
            isError: false,
            error: null
        });

        const { container } = renderPage();
        expect(container.querySelector(".ant-spin")).toBeInTheDocument();
    });

    it("renders error state correctly", () => {
        vi.mocked(useMyProducts).mockReturnValue({
            products: [],
            isLoading: false,
            isError: true,
            error: new Error("Failed to fetch products")
        });

        renderPage();
        expect(screen.getByText(/Failed to fetch products/i)).toBeInTheDocument();
    });

    it("renders empty state correctly", () => {
        vi.mocked(useMyProducts).mockReturnValue({
            products: [],
            isLoading: false,
            isError: false,
            error: null
        });

        renderPage();
        expect(screen.getByText(/Bạn chưa có sản phẩm nào/i)).toBeInTheDocument();

        const exploreBtn = screen.getByRole("button", { name: /Khám phá ngay/i });
        fireEvent.click(exploreBtn);
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("renders products list correctly", () => {
        const mockProducts: Product[] = [
            {
                id: 1,
                name: "iPhone 13 Pro",
                price: 15000000,
                status: "ACTIVE",
                startDate: "2024-01-01",
                endDate: "2024-02-01",
                code: "P001",
                category: { id: 1, name: "Điện thoại" }
            } as any,
            {
                id: 2,
                name: "Honda SH 150i",
                price: 80000000,
                status: "EXPIRED",
                startDate: "2023-12-01",
                endDate: "2024-01-01",
                code: "P002",
                category: { id: 2, name: "Xe máy" }
            } as any
        ];

        vi.mocked(useMyProducts).mockReturnValue({
            products: mockProducts,
            isLoading: false,
            isError: false,
            error: null
        });

        renderPage();

        // Check header and count
        expect(screen.getByText("Sản phẩm của tôi")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument(); // Badge count

        // Check product details
        expect(screen.getByText("iPhone 13 Pro")).toBeInTheDocument();
        expect(screen.getByText("P001")).toBeInTheDocument();
        expect(screen.getByText("Đang cầm cố")).toBeInTheDocument();

        expect(screen.getByText("Honda SH 150i")).toBeInTheDocument();
        expect(screen.getByText("P002")).toBeInTheDocument();
        expect(screen.getByText("Đã quá hạn")).toBeInTheDocument();

        // Check currency formatting
        expect(screen.getByText(/15.000.000/)).toBeInTheDocument();

        // Check navigation to details
        const detailBtns = screen.getAllByText(/Xem chi tiết/i);
        fireEvent.click(detailBtns[0]);
        expect(mockNavigate).toHaveBeenCalledWith("/products/1");
    });
});
