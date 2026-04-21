import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import UserAuthForm from "../UserAuthForm";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe("UserAuthForm", () => {
    const defaultProps = {
        mode: "login" as const,
        onSubmit: vi.fn(),
        isLoading: false,
        handleLoginGoogle: vi.fn()
    };

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(ui, { wrapper: BrowserRouter });
    };

    it("renders login mode correctly", () => {
        renderWithRouter(<UserAuthForm {...defaultProps} />);

        expect(screen.getByText("Chào mừng trở lại")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Đăng nhập" })).toBeInTheDocument();
        expect(screen.queryByLabelText("Họ và tên")).not.toBeInTheDocument();
    });

    it("renders register mode correctly", () => {
        renderWithRouter(<UserAuthForm {...defaultProps} mode="register" />);

        expect(screen.getByText("Tạo tài khoản mới")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Đăng ký ngay" })).toBeInTheDocument();
        expect(screen.getByLabelText("Họ và tên")).toBeInTheDocument();
    });

    it("triggers onSubmit with correct values on login", async () => {
        renderWithRouter(<UserAuthForm {...defaultProps} />);

        fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123"
            });
        });
    });

    it("triggers social login handlers", () => {
        renderWithRouter(<UserAuthForm {...defaultProps} />);

        fireEvent.click(screen.getByText("Google"));
        expect(defaultProps.handleLoginGoogle).toHaveBeenCalled();
    });

    it("navigates to register page when link clicked", () => {
        renderWithRouter(<UserAuthForm {...defaultProps} />);

        fireEvent.click(screen.getByText("Đăng ký ngay"));
        expect(mockNavigate).toHaveBeenCalledWith("/register");
    });
});
