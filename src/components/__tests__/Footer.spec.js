import { describe, it, expect } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import Footer from "../Footer.vue";

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Footer.vue", () => {
  it("renders correctly", () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Vue Jobs");
  });

  it("displays the correct dynamic year", () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    const currentYear = new Date().getFullYear();
    // Updated assertion to match current Footer.vue text
    expect(wrapper.text()).toContain(
      `© ${currentYear} Vue Jobs. All Rights Reserved.`
    );
  });

  it("contains expected navigation links", () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    const links = wrapper.findAll("a");
    // Updated expectations based on current Footer.vue template
    const privacyLink = links.find((link) => link.text() === "Privacy Policy");
    const termsLink = links.find((link) => link.text() === "Terms of Service");

    expect(privacyLink).toBeDefined();
    expect(termsLink).toBeDefined();
  });
});
