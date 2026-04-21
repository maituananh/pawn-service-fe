import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatisticCard from "../StatisticCard";

describe("StatisticCard", () => {
    it("renders title and value correctly", () => {
        render(
            <StatisticCard title="Total Products" value={123} prefix={<span data-testid="prefix-icon">Icon</span>} />
        );

        expect(screen.getByText("Total Products")).toBeInTheDocument();
        expect(screen.getByText("123")).toBeInTheDocument();
        expect(screen.getByTestId("prefix-icon")).toBeInTheDocument();
    });
});
