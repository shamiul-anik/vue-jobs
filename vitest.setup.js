import { vi, beforeEach } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

// Mock localStorage with a proper implementation
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

// Create a simple router for testing
export const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/jobs', component: { template: '<div>Jobs</div>' } },
    ],
  });
};

// Reset mocks before each test
export const resetMocks = () => {
  localStorage.clear();
};

// Auto-reset before each test
beforeEach(() => {
  localStorage.clear();
});
