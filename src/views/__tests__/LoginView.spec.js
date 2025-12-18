import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import LoginView from '../LoginView.vue';
import { createRouter, createMemoryHistory } from 'vue-router';

// Mock the useAuth composable
vi.mock('../../composables/useAuth.js', () => ({
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: { value: false },
    user: { value: null },
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('LoginView.vue', () => {
  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/register', component: { template: '<div>Register</div>' } },
      ],
    });
  };

  beforeEach(() => {
    fetch.mockClear();
    vi.clearAllMocks();
  });

  it('renders login form', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    expect(wrapper.text()).toContain('Sign in to Your Account');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('has email input with correct attributes', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const emailInput = wrapper.find('input[type="email"]');
    expect(emailInput.exists()).toBe(true);
    expect(emailInput.attributes('placeholder')).toContain('example.com');
    expect(emailInput.attributes('required')).toBeDefined();
  });

  it('has password input field', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const passwordInput = wrapper.find('input[type="password"]');
    expect(passwordInput.exists()).toBe(true);
    expect(passwordInput.attributes('required')).toBeDefined();
  });

  it('has sign in button', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const button = wrapper.find('button[type="submit"]');
    expect(button.exists()).toBe(true);
    expect(button.text().toLowerCase()).toContain('sign in');
  });

  it('updates email input value', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const emailInput = wrapper.find('input[type="email"]');
    await emailInput.setValue('test@example.com');

    expect(emailInput.element.value).toBe('test@example.com');
  });

  it('updates password input value', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const passwordInput = wrapper.find('input[type="password"]');
    await passwordInput.setValue('password123');

    expect(passwordInput.element.value).toBe('password123');
  });

  it('has password visibility toggle button', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const toggleButton = wrapper.find('button[type="button"]');
    expect(toggleButton.exists()).toBe(true);
  });
});
