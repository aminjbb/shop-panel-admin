import type { AdminRole } from "../types";

const ROUTES_BY_ROLE: Record<AdminRole, ReadonlySet<string>> = {
  super_admin: new Set([
    "dashboard", "homepage", "products", "categories", "orders", "customers",
    "coupons", "feedback", "support", "settings", "staff",
  ]),
  inventory_manager: new Set(["dashboard", "homepage", "products", "categories", "coupons"]),
  support_agent: new Set(["dashboard", "customers", "feedback", "support"]),
};

export function canAccessAdminRoute(role: AdminRole, route: string): boolean {
  return route === "login" || ROUTES_BY_ROLE[role].has(route);
}
