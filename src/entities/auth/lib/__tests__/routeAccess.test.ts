import { describe, expect, it } from "vitest";
import { canAccessAdminRoute } from "../routeAccess";

describe("canAccessAdminRoute", () => {
  it("allows login for every role", () => {
    expect(canAccessAdminRoute("support_agent", "login")).toBe(true);
  });

  it("keeps role boundaries for protected routes", () => {
    expect(canAccessAdminRoute("support_agent", "products")).toBe(false);
    expect(canAccessAdminRoute("inventory_manager", "products")).toBe(true);
    expect(canAccessAdminRoute("super_admin", "staff")).toBe(true);
  });
});
