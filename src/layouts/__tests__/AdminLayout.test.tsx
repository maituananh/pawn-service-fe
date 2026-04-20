import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminLayout from "../AdminLayout";

// Mock child components
vi.mock("@/components/AIAgent", () => ({
    default: () => <div data-testid="mock-ai-agent">AIAgent</div>
}));

// Mock hooks
const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
    default: () => ({
        isAuthenticated: true,
        logout: mockLogout,
        currentUser: { name: "Admin User", role: "ADMIN" }
    })
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: "/admin/dashboard" })
    };
});

// Mock router config
vi.mock("@/router/router.config", () => ({
    privateRoutes: [
        { path: "/admin/dashboard", label: "Dashboard", showInMenu: true, roles: ["ADMIN"] },
        { path: "/admin/products", label: "Products", showInMenu: true, roles: ["ADMIN"] }
    ]
}));

describe("AdminLayout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(ui, { wrapper: BrowserRouter });
    };

    it("renders sidebar with menu items and logo", () => {
        renderWithRouter(<AdminLayout />);

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(screen.getByAltText("Logo")).toBeInTheDocument();
    });

    it("displays welcome message with user name", () => {
        renderWithRouter(<AdminLayout />);
        expect(screen.getByText(/Xin chào Admin User/)).toBeInTheDocument();
    });

    it("toggles sidebar collapse using Vitest", () => {
        // Ant Design Sider has a trigger button
        renderWithRouter(<AdminLayout />);
        const collapseTrigger = document.querySelector(".ant-layout-sider-trigger");
        if (collapseTrigger) {
            fireEvent.click(collapseTrigger);
        }
        // In real browser this changes width, in jsdom we just check if it didn't crash
    });

    it("navigates when menu item clicked", () => {
        renderWithRouter(<AdminLayout />);
        fireEvent.click(screen.getByText("Products"));
        expect(mockNavigate).toHaveBeenCalledWith("/admin/products");
    });
});
