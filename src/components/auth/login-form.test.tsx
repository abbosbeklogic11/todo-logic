import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

const push = vi.fn();

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}));

import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(signIn).mockReset().mockResolvedValue({
      ok: true,
      error: undefined,
      status: 200,
      url: null,
      code: undefined,
    } as unknown as Awaited<ReturnType<typeof signIn>>);
    push.mockClear();
  });

  it("shows validation errors when submitted empty", async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: /kirish/i }));
    expect(
      await screen.findByText(/noto'g'ri email manzili/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/parol kiritilishi shart/i),
    ).toBeInTheDocument();
  });

  it("calls signIn with credentials and redirects on success", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), "a@example.com");
    await userEvent.type(screen.getByLabelText(/parol/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /kirish/i }));
    // signIn should be invoked with credentials
    expect(vi.mocked(signIn)).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({
        email: "a@example.com",
        password: "password123",
        redirect: false,
      }),
    );
  });
});
