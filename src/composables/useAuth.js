import { reactive, computed } from "vue";

// Global state (singleton pattern) so it's shared across components
const state = reactive({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"), // Use user presence as initial auth state
});

export function useAuth() {
  const login = (userData) => {
    state.user = userData;
    state.isAuthenticated = true;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call server to clear cookie
      const httpClient = (await import("../services/httpClient")).default;
      await httpClient.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    }
  };

  const isAuthenticated = computed(() => state.isAuthenticated);
  const user = computed(() => state.user);

  return {
    login,
    logout,
    isAuthenticated,
    user,
  };
}
