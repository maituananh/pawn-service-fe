import { errorEmitter } from "@/lib/errorEmitter";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ErrorToast from "../ErrorToast";

// Mock URL.createObjectURL and window.open
global.URL.createObjectURL = vi.fn(() => "mock-url");
window.open = vi.fn();

describe("ErrorToast", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the singleton if necessary, but here we just subscribe
    });

    it("renders nothing initially", () => {
        render(<ErrorToast />);
        expect(screen.queryByText("Lỗi")).not.toBeInTheDocument();
    });

    it("displays toast when errorEmitter emits an error", async () => {
        render(<ErrorToast />);

        act(() => {
            errorEmitter.emit({ message: "Network Error", fullDetail: "{}" });
        });

        expect(screen.getByText("Network Error")).toBeInTheDocument();
        expect(screen.getByText("Lỗi")).toBeInTheDocument();
    });

    it("dismisses toast when close button clicked", async () => {
        vi.useFakeTimers();
        render(<ErrorToast />);

        act(() => {
            errorEmitter.emit({ message: "Network Error", fullDetail: "{}" });
        });

        const closeBtn = screen.getByLabelText("Close");
        fireEvent.click(closeBtn);

        // ErrorToast has a 300ms transition before removal
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(screen.queryByText("Network Error")).not.toBeInTheDocument();
        vi.useRealTimers();
    });

    it("opens detail page when View detail clicked", () => {
        render(<ErrorToast />);

        act(() => {
            errorEmitter.emit({ message: "Error", fullDetail: '{"status": 500}' });
        });

        const viewDetailBtn = screen.getByText("🔍 View detail");
        fireEvent.click(viewDetailBtn);

        expect(window.open).toHaveBeenCalledWith("mock-url", "_blank");
    });
});
