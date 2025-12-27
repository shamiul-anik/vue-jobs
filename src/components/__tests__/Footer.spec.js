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
    // Updated expectation based on new template
    expect(wrapper.text()).toContain(
      `${currentYear} VueJobs.com. Built by the community.`
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
    // Updated expectations based on new template: "Privacy", "Terms", "Cookies"
    const privacyLink = links.find((link) => link.text() === "Privacy");
    const termsLink = links.find((link) => link.text() === "Terms");
    const cookiesLink = links.find((link) => link.text() === "Cookies");

    expect(privacyLink).toBeDefined();
    expect(termsLink).toBeDefined();
    expect(cookiesLink).toBeDefined();
  });
});
