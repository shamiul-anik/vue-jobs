import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useAuth } from "../useAuth.js";

describe("useAuth composable", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
  });

  it("should have initial state when no user is logged in", () => {
    const { isAuthenticated, user } = useAuth();
    expect(isAuthenticated.value).toBe(false);
    expect(user.value).toBe(null);
  });

  it("should provide logout function", () => {
    const { logout } = useAuth();
    expect(typeof logout).toBe("function");
  });

  it("should provide login function", () => {
    const { login } = useAuth();
    expect(typeof login).toBe("function");
  });

  it("should update auth state after login", () => {
    const { login, isAuthenticated, user } = useAuth();
    const testUser = { id: 1, name: "Test User", email: "test@test.com" };

    login(testUser);

    expect(isAuthenticated.value).toBe(true);
    expect(user.value).toEqual(testUser);
  });

  it("should clear auth state after logout", async () => {
    const { login, logout, isAuthenticated, user } = useAuth();
    const testUser = { id: 1, name: "Test User", email: "test@test.com" };

    login(testUser);
    expect(isAuthenticated.value).toBe(true);

    // Mock global fetch for logout call
    global.fetch = () =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({}),
      });

    await logout();
    expect(isAuthenticated.value).toBe(false);
    expect(user.value).toBe(null);
  });
});
