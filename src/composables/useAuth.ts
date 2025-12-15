import { reactive, computed, Ref, ComputedRef } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

// Global state (singleton pattern) so it's shared across components
const state = reactive<AuthState>({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
});

export function useAuth() {
  const login = (userData: User, token: string) => {
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
