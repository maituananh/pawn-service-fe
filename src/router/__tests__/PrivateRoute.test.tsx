import useAuth from "@/hooks/useAuth";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PrivateRoute } from "../PrivateRoute";

vi.mock("@/hooks/useAuth");

describe("PrivateRoute", () => {
    it("redirects to login when not authenticated", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            currentUser: null,
            role: undefined,
            login: vi.fn() as any,
            logout: vi.fn(),
            isLoadingLogin: false
        });

        render(
            <MemoryRouter initialEntries={["/admin"]}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/admin" element={<PrivateRoute element={<div>Admin Content</div>} />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    });

    it("redirects to home when role is not allowed", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            currentUser: { role: "CUSTOMER" } as any,
            role: "CUSTOMER",
            login: vi.fn() as any,
            logout: vi.fn(),
            isLoadingLogin: false
        });

        render(
            <MemoryRouter initialEntries={["/admin"]}>
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/admin" element={<PrivateRoute roles={["ADMIN"]} element={<div>Admin Content</div>} />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    });

    it("renders content when authenticated and role is allowed", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            currentUser: { role: "ADMIN" } as any,
            role: "ADMIN",
            login: vi.fn() as any,
            logout: vi.fn(),
            isLoadingLogin: false
        });

        render(
            <MemoryRouter initialEntries={["/admin"]}>
                <Routes>
                    <Route path="/admin" element={<PrivateRoute roles={["ADMIN"]} element={<div>Admin Content</div>} />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Admin Content")).toBeInTheDocument();
    });
});
