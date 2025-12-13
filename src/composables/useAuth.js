import { reactive, computed } from "vue";

// Global state (singleton pattern) so it's shared across components
const state = reactive({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
});

export function useAuth() {
  const login = (userData, token) => {
    state.user = userData;
    state.token = token;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    state.user = null;
    state.token = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = computed(() => !!state.token);
  const user = computed(() => state.user);

  return {
    login,
    logout,
    isAuthenticated,
    user,
  };
}
