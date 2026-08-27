import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders with text and handles click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Boshlash</Button>);
    const btn = screen.getByRole("button", { name: "Boshlash" });
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled and does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Bloklangan
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows aria-busy and keeps its label while loading", () => {
    render(<Button loading>Saqlash</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
    expect(screen.getByText("Saqlash")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="secondary">Ikkinchi</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-surface");
  });
});
