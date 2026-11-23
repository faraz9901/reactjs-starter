import { describe, expect, it } from "vitest";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("exposes stable top-level paths", () => {
    expect(ROUTES.HOME).toBe("/");
    expect(ROUTES.ABOUT).toBe("/about");
    expect(ROUTES.AUTH.LOGIN).toBe("/login");
    expect(ROUTES.DASHBOARD.ROOT).toBe("/dashboard");
  });

  it("never yields a trailing slash on nested routes", () => {
    expect(ROUTES.DASHBOARD.ROOT.endsWith("/")).toBe(false);
  });
});
