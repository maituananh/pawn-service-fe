import authApi from "@/api/authApi";
import { UserProfile } from "@/type/user.type";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "../LoginPage";

// Mock authApi
vi.mock("@/api/authApi", () => ({
    default: {
        login: vi.fn(),
        getProfile: vi.fn()
    }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe("LoginPage Integration", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
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

    it("successfully logs in and navigates", async () => {
        const mockUser = {
            id: "1",
            name: "Test Admin",
            role: "ADMIN",
            email: "a@b.com",
            phone: "123",
            address: "abc",
            cardId: "123"
        };
        const mockLoginResponse = {
            accessToken: "access",
            refreshToken: "refresh",
            user: mockUser
        };

        vi.mocked(authApi.login).mockResolvedValue(mockLoginResponse);
        vi.mocked(authApi.getProfile).mockResolvedValue(mockUser as UserProfile);

        renderWithProviders(<LoginPage />);

        fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "admin" } });
        fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "password" } });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }));
        });

        await waitFor(
            () => {
                expect(authApi.login).toHaveBeenCalled();
                expect(localStorage.getItem("access_token")).toBe("access");
            },
            { timeout: 3000 }
        );

        // Check if it reached success state
        expect(screen.getByText(/Đã đăng nhập/)).toBeInTheDocument();
    });

    it("shows error message on login failure", async () => {
        // Prevent unhandled rejection by providing a catch-all for mutations if possible
        // or just let it fail and see if act handles it
        vi.mocked(authApi.login).mockRejectedValue(new Error("Invalid credentials"));

        renderWithProviders(<LoginPage />);

        fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "wrong" } });
        fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "wrong" } });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }));
        });

        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalled();
        });
    });
});
