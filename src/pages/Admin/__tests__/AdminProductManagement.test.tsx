import categoriesApi from "@/api/categoriesApi";
import productsApi from "@/api/productsApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminProductCreatePage from "../AdminProductCreatePage";
import AdminProductsPage from "../AdminProductsPage";

// Mock matchMedia for antd
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
});

vi.mock("@/api/productsApi");
vi.mock("@/api/filesApi");
vi.mock("@/api/categoriesApi");
vi.mock("@/hooks/useUsers", () => ({
    useUsers: () => ({ users: [] })
}));
vi.mock("@/features/DashboardStatsFeature", () => ({
    default: () => <div data-testid="dashboard-stats" />
}));

describe("Admin Product Management Integration", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem("access_token", "admin-token");
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
            }
        });

        vi.mocked(categoriesApi.getAll).mockResolvedValue([]);
    });

    const renderFlow = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={["/admin/products"]}>
                    <Routes>
                        <Route path="/admin/products" element={<AdminProductsPage />} />
                        <Route path="/admin/products/create" element={<AdminProductCreatePage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    };

    it("renders products list and navigates to create page", async () => {
        const mockProducts = {
            data: [{ id: 1, name: "Admin Product 1", price: 1000000, isActived: true, status: "READY" }],
            totalElements: 1
        };
        vi.mocked(productsApi.search).mockResolvedValue(mockProducts as any);

        renderFlow();

        // 1. Check List Page
        await waitFor(() => {
            expect(screen.getByText("Admin Product 1")).toBeInTheDocument();
        });

        // Click create button
        const addBtn = screen.getByRole("button", { name: /Thêm mới/i });
        fireEvent.click(addBtn);

        // 2. Check Create Page (ProductForm)
        await waitFor(() => {
            expect(screen.getByText(/Tạo hợp đồng mới/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Tên sản phẩm/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Mã hợp đồng/i)).toBeInTheDocument();
        });

        // Test cancel navigation
        const cancelBtn = screen.getByRole("button", { name: /Hủy bỏ/i });
        fireEvent.click(cancelBtn);

        await waitFor(() => {
            expect(screen.getByText("Admin Product 1")).toBeInTheDocument();
        });
    }, 30000);
});
