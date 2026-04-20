import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductCartCard from "../ProductCartCard";

describe("ProductCartCard", () => {
    const defaultProps = {
        id: 1,
        name: "Test Laptop",
        price: 15000000,
        quantity: 1,
        image: "laptop.jpg",
        checked: false,
        onCheckChange: vi.fn(),
        onDelete: vi.fn()
    };

    it("renders product info correctly", () => {
        render(<ProductCartCard {...defaultProps} />);

        expect(screen.getByText("Test Laptop")).toBeInTheDocument();
        // Price appears twice (unit price and total price)
        const priceElements = screen.getAllByText(/15,000,000/);
        expect(priceElements.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Số lượng: 1/)).toBeInTheDocument();
        expect(screen.getByAltText("Test Laptop")).toHaveAttribute("src", "laptop.jpg");
    });

    it("triggers onCheckChange when checkbox clicked", () => {
        render(<ProductCartCard {...defaultProps} />);

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(defaultProps.onCheckChange).toHaveBeenCalledWith(1, true);
    });

    it("triggers onDelete when delete button clicked", () => {
        render(<ProductCartCard {...defaultProps} />);

        const deleteButton = screen.getByRole("button", { name: /xoá/i });
        fireEvent.click(deleteButton);

        expect(defaultProps.onDelete).toHaveBeenCalledWith(1);
    });
});
