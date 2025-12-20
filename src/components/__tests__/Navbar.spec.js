import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Navbar from "../Navbar.vue";
import { createTestRouter, resetMocks } from "../../../vitest.setup.js";

describe("Navbar.vue", () => {
  let router;

  beforeEach(() => {
    resetMocks();
    router = createTestRouter();
  });

  it("renders the navbar component", async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
        },
      },
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });

  it("renders navigation links", async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
        stubs: {},
      },
    });
    await router.isReady();
    const html = wrapper.html();
    expect(html).toContain("Home");
    expect(html).toContain("Jobs");
  });
});
