import useAuth from "@/hooks/useAuth";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../Header";

// Mock hooks
const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
    default: vi.fn(() => ({
        isAuthenticated: false,
        logout: mockLogout,
        currentUser: null
    }))
}));

vi.mock("@/hooks/useCart", () => ({
    useCart: () => ({
        cart: []
    })
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: "/" })
    };
});

describe("Header", () => {
    const menuItems = [
        { key: "/", label: "Home" },
        { key: "/products", label: "Products" }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(ui, { wrapper: BrowserRouter });
    };

    it("renders logo and login button when not authenticated", () => {
        renderWithRouter(<Header menuItems={menuItems as any} />);

        expect(screen.getByText(/Camdo/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Đăng nhập/i })).toBeInTheDocument();
    });

    it("renders user profile and cart when authenticated", () => {
        // Override useAuth mock for this test
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            logout: mockLogout,
            currentUser: { name: "Test User", avatar: null }
        } as any);

        renderWithRouter(<Header menuItems={menuItems as any} />);

        expect(screen.getByText("User")).toBeInTheDocument(); // Name splits and takes last part, ui-avatars default
        // The header splits the name and takes the last part or "Tài khoản"
        // In the code: {currentUser?.name?.split(" ").pop() || "Tài khoản"}
        // "Test User".split(" ").pop() is "User"

        expect(screen.queryByRole("button", { name: /Đăng nhập/i })).not.toBeInTheDocument();
    });

    it("navigates when menu item clicked", () => {
        renderWithRouter(<Header menuItems={menuItems as any} />);

        fireEvent.click(screen.getByText("Products"));
        expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
});
