import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import MainLayout from "../MainLayout";

// Mock child components
vi.mock("../../components/Header", () => ({
    default: () => <div data-testid="mock-header">Header</div>
}));
vi.mock("../../components/Footer", () => ({
    default: () => <div data-testid="mock-footer">Footer</div>
}));
vi.mock("../../components/AIAgent", () => ({
    default: () => <div data-testid="mock-ai-agent">AIAgent</div>
}));

// Mock hooks
vi.mock("@/hooks/useAuth", () => ({
    default: () => ({
        role: "CUSTOMER"
    })
}));

// Mock router config
vi.mock("@/router/router.config", () => ({
    publicRoutes: [{ path: "/", label: "Home", showInMenu: true }],
    privateRoutes: [{ path: "/profile", label: "Profile", showInMenu: true, roles: ["CUSTOMER"] }]
}));

describe("MainLayout", () => {
    it("renders header, footer, ai-agent and outlet wrapper", () => {
        render(
            <BrowserRouter>
                <MainLayout />
            </BrowserRouter>
        );

        expect(screen.getByTestId("mock-header")).toBeInTheDocument();
        expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
        expect(screen.getByTestId("mock-ai-agent")).toBeInTheDocument();
        expect(document.querySelector(".main-content")).toBeInTheDocument();
    });
});
