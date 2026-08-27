import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordStrength } from "./password-strength";

describe("PasswordStrength", () => {
  it("renders nothing for empty password", () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows all checks passing for a strong password", () => {
    render(<PasswordStrength password="Strong1!" />);
    expect(screen.getByText("Kuchli")).toBeInTheDocument();
    expect(screen.getAllByText(/katta harf/i).length).toBeGreaterThan(0);
  });

  it("reports weak password with missing rules", () => {
    render(<PasswordStrength password="abc" />);
    expect(screen.getByText(/zaif/i)).toBeInTheDocument();
  });
});
