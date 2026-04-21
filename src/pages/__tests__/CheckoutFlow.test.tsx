import cartApi from "@/api/cartApi";
import orderApi from "@/api/orderApi";
import useAuth from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CartPage from "../CartPage";
import CheckoutPage from "../CheckoutPage";

vi.mock("@/api/cartApi");
vi.mock("@/api/orderApi");
vi.mock("@/hooks/useAuth");

describe("Checkout Flow Integration", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem("access_token", "test-token");
        queryClient = new QueryClient({
            defaultOptions: { 
                queries: { retry: false },
                mutations: { retry: false }
            }
        });

        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            currentUser: { name: "Test User", phone: "0123456789", address: "Hanoi" } as any,
            role: "CUSTOMER",
            login: vi.fn() as any,
            logout: vi.fn(),
            isLoadingLogin: false
        });
    });

    const renderFlow = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={["/mycart"]}>
                    <Routes>
                        <Route path="/mycart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders/:id" element={<div>Order Success Page</div>} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    };

    it("successfully completes checkout flow from cart to success", async () => {
        const mockCartItems = [ 
            { 
                cartItemId: 1, 
                productId: 101, 
                productName: "Laptop", 
                price: 10000000, 
                quantity: 1, 
                image: "", 
                isActived: true, 
                status: "READY" 
            }
        ];
        
        vi.mocked(cartApi.getMyCart).mockResolvedValue({ items: mockCartItems } as any);
        vi.mocked(orderApi.checkout).mockResolvedValue({ orderId: 456 } as any);

        renderFlow();

        // 1. Cart Page - Wait for data
        await waitFor(() => {
            expect(screen.getByText("Laptop")).toBeInTheDocument();
        });

        // Select item
        const checkbox = screen.getAllByRole("checkbox")[1]; // First is "Select All", second is for item
        fireEvent.click(checkbox);

        // Click "Mua ngay"
        const buyBtn = screen.getByRole("button", { name: /Mua ngay/i });
        fireEvent.click(buyBtn);

        // 2. Checkout Page
        await waitFor(() => {
            expect(screen.getByText("Thông tin giao hàng")).toBeInTheDocument();
        });

        // Verify pre-filled data
        expect(screen.getByLabelText(/Họ và tên/i)).toHaveValue("Test User");
        expect(screen.getByLabelText(/Số điện thoại/i)).toHaveValue("0123456789");

        // Submit form
        const submitBtn = screen.getByRole("button", { name: /Đặt hàng ngay/i });
        fireEvent.click(submitBtn);

        // 3. Success Page (redirected to /orders/456)
        await waitFor(() => {
            expect(orderApi.checkout).toHaveBeenCalled();
            expect(screen.getByText("Order Success Page")).toBeInTheDocument();
        });
    });
});
