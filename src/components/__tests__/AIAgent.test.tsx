import chatApi from "@/api/chatApi";
import useAuth from "@/hooks/useAuth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AIAgent from "../AIAgent";

// Mock robot icon
vi.mock("../assets/images/ai-robot-icon.png", () => ({
    default: "robot-icon.png"
}));

vi.mock("@/api/chatApi");
vi.mock("@/hooks/useAuth");
vi.mock("@/api/filesApi");

describe("AIAgent", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            currentUser: { name: "Test User", avatar: null } as any,
            role: "CUSTOMER",
            login: vi.fn() as any,
            logout: vi.fn(),
            isLoadingLogin: false
        });
        vi.mocked(chatApi.getHistory).mockResolvedValue([]);
    });

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    it("renders the floating button initially", () => {
        renderWithProviders(<AIAgent />);
        // The floating button contains the robot icon
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens chat window when clicked", async () => {
        renderWithProviders(<AIAgent />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("AI Assistant")).toBeInTheDocument();
        expect(screen.getByText(/Xin chào! Tôi là trợ lý AI/)).toBeInTheDocument();
    });

    it("fetches history when opened", async () => {
        const mockHistory = [
            {
                userMessage: "Hello",
                aiResponse: {
                    data: { reply: "Hi there!", intent: "DEFAULT" }
                },
                timestamp: new Date().toISOString()
            }
        ];
        vi.mocked(chatApi.getHistory).mockResolvedValue(mockHistory as any);

        renderWithProviders(<AIAgent />);
        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(chatApi.getHistory).toHaveBeenCalled();
            expect(screen.getByText("Hello")).toBeInTheDocument();
            expect(screen.getByText("Hi there!")).toBeInTheDocument();
        });
    });

    it("sends a message and receives AI response", async () => {
        vi.mocked(chatApi.sendMessage).mockResolvedValue({
            reply: "I am a robot",
            intent: "DEFAULT"
        });

        renderWithProviders(<AIAgent />);
        fireEvent.click(screen.getByRole("button"));

        const input = screen.getByPlaceholderText("Nhập nội dung...");
        fireEvent.change(input, { target: { value: "Who are you?" } });

        // Find send button (the one with SendOutlined)
        const sendBtn = screen.getByRole("button", { name: /send/i });
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(chatApi.sendMessage).toHaveBeenCalledWith({
                content: "Who are you?",
                fileUrl: undefined
            });
            expect(screen.getByText("I am a robot")).toBeInTheDocument();
        });
    });

    it("displays profile data correctly", async () => {
        const mockProfileMessage = {
            reply: "Here is your profile",
            intent: "PROFILE",
            result: {
                name: "John Doe",
                email: "john@example.com",
                phone: "0987654321",
                address: "Hanoi"
            }
        };
        vi.mocked(chatApi.sendMessage).mockResolvedValue(mockProfileMessage as any);

        renderWithProviders(<AIAgent />);
        fireEvent.click(screen.getByRole("button"));

        fireEvent.change(screen.getByPlaceholderText("Nhập nội dung..."), { target: { value: "my profile" } });
        fireEvent.click(screen.getByRole("button", { name: /send/i }));

        await waitFor(() => {
            expect(screen.getByText("Thông tin cá nhân")).toBeInTheDocument();
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("john@example.com")).toBeInTheDocument();
            expect(screen.getByText("0987654321")).toBeInTheDocument();
        });
    });

    it("displays order list correctly", async () => {
        const mockOrderMessage = {
            reply: "List of orders",
            intent: "ORDER",
            result: {
                orders: [
                    { orderId: "ORD123", status: "PENDING", totalAmount: 1000000, createdAt: new Date().toISOString() }
                ]
            }
        };
        vi.mocked(chatApi.sendMessage).mockResolvedValue(mockOrderMessage as any);

        renderWithProviders(<AIAgent />);
        fireEvent.click(screen.getByRole("button"));

        fireEvent.change(screen.getByPlaceholderText("Nhập nội dung..."), { target: { value: "my orders" } });
        fireEvent.click(screen.getByRole("button", { name: /send/i }));

        await waitFor(() => {
            expect(screen.getByText("Danh sách đơn hàng liên quan")).toBeInTheDocument();
            expect(screen.getByText("#ORD123")).toBeInTheDocument();
            expect(screen.getByText("Chờ thanh toán")).toBeInTheDocument();
            expect(screen.getByText(/1.000.000/)).toBeInTheDocument();
        });
    });
});
