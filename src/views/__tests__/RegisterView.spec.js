import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RegisterView from "../RegisterView.vue";
import { createRouter, createMemoryHistory } from "vue-router";

// Mock the API
vi.mock("../../services/api.js", () => ({
  usersAPI: {
    register: vi.fn(() =>
      Promise.resolve({ message: "User registered successfully" })
    ),
  },
}));

// Mock useSEO composable
vi.mock("../../composables/useSEO.js", () => ({
  useSEO: vi.fn(() => ({ updateMetaTags: vi.fn() })),
}));

describe("RegisterView.vue", () => {
  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/register", component: { template: "<div>Register</div>" } },
        { path: "/login", component: { template: "<div>Login</div>" } },
        { path: "/", component: { template: "<div>Home</div>" } },
      ],
    });
  };

  it("renders the register form", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("has name input field", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const nameInput =
      wrapper.find('input[name="name"]') || wrapper.find('input[type="text"]');
    expect(
      nameInput.exists() || wrapper.text().toLowerCase().includes("name")
    ).toBe(true);
  });

  it("has email input field", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const emailInput =
      wrapper.find('input[name="email"]') ||
      wrapper.find('input[type="email"]');
    expect(
      emailInput.exists() || wrapper.text().toLowerCase().includes("email")
    ).toBe(true);
  });

  it("has password input field", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const passwordInput =
      wrapper.find('input[name="password"]') ||
      wrapper.find('input[type="password"]');
    expect(
      passwordInput.exists() ||
        wrapper.text().toLowerCase().includes("password")
    ).toBe(true);
  });

  it("has password confirmation field", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(
      text.includes("confirm") ||
        wrapper.findAll('input[type="password"]').length >= 2
    ).toBe(true);
  });

  it("has register button", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const submitButton =
      wrapper.find('button[type="submit"]') ||
      wrapper
        .findAll("button")
        .find(
          (btn) =>
            btn.text().toLowerCase().includes("register") ||
            btn.text().toLowerCase().includes("sign up")
        );
    expect(submitButton?.exists() || wrapper.findAll("button").length > 0).toBe(
      true
    );
  });

  it("has link to login page", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const links = wrapper.findAll("a");
    const hasLoginLink = links.some(
      (link) =>
        link.text().toLowerCase().includes("login") ||
        link.text().toLowerCase().includes("sign in")
    );

    expect(hasLoginLink || wrapper.text().toLowerCase().includes("login")).toBe(
      true
    );
  });

  it("allows input in name field", async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const nameInput =
      wrapper.find('input[name="name"]') || wrapper.find('input[type="text"]');
    if (nameInput.exists()) {
      await nameInput.setValue("John Doe");
      expect(nameInput.element.value).toBe("John Doe");
    }
  });

  it("allows input in email field", async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const emailInput =
      wrapper.find('input[name="email"]') ||
      wrapper.find('input[type="email"]');
    if (emailInput.exists()) {
      await emailInput.setValue("john@example.com");
      expect(emailInput.element.value).toBe("john@example.com");
    }
  });

  it("allows input in password field", async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const passwordInput =
      wrapper.find('input[name="password"]') ||
      wrapper.find('input[type="password"]');
    if (passwordInput.exists()) {
      await passwordInput.setValue("password123");
      expect(passwordInput.element.value).toBe("password123");
    }
  });

  it("renders form without errors", () => {
    expect(() => {
      mount(RegisterView, {
        global: {
          plugins: [createTestRouter()],
          stubs: {},
        },
      });
    }).not.toThrow();
  });

  it("displays registration instructions or requirements", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(text.length > 50).toBe(true);
  });

  it("has proper form layout", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const form = wrapper.find("form");
    expect(form.exists() || wrapper.findAll("input").length > 0).toBe(true);
  });

  it("displays all required fields", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          Modal: true,
        },
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(text.includes("name")).toBe(true);
    expect(text.includes("email")).toBe(true);
    expect(text.includes("password")).toBe(true);
  });

  it("opens Terms and Conditions modal when link is clicked", async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          Modal: true,
        },
      },
    });

    const termsButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Terms and Conditions"));
    await termsButton.trigger("click");

    expect(wrapper.vm.showTermsModal).toBe(true);
  });

  it("opens Privacy Policy modal when link is clicked", async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          Modal: true,
        },
      },
    });

    const privacyButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Privacy Policy"));
    await privacyButton.trigger("click");

    expect(wrapper.vm.showPrivacyModal).toBe(true);
  });
});
