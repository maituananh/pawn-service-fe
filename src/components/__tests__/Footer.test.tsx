import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "../Footer";

describe("Footer", () => {
    it("renders policy information and copyright", () => {
        render(<Footer />);

        expect(screen.getByText("Cam kết bảo mật & An toàn")).toBeInTheDocument();
        expect(screen.getByText(/Lãi suất vay trong hạn tối đa 30%\/năm/)).toBeInTheDocument();
        expect(screen.getByText(/Thảo Quyên/)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(new Date().getFullYear().toString()))).toBeInTheDocument();
    });
});
