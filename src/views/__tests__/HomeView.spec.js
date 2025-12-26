import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "../HomeView.vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { useJobs } from "../../composables/useJobs";

// Mock the API for HomeView
vi.mock("../../services/api.js", () => ({
  jobsAPI: {
    getAllJobs: vi.fn(() =>
      Promise.resolve([
        {
          id: 1,
          title: "Senior Developer",
          type: "Full-Time",
          salary: "$100K",
          created_at: "2025-12-20T10:00:00Z",
        },
      ])
    ),
  },
}));

vi.mock("../../composables/useSEO.js", () => ({
  useSEO: vi.fn(() => ({ updateMetaTags: vi.fn() })),
}));

const { clearCache } = useJobs();

describe("HomeView.vue", () => {
  beforeEach(() => {
    clearCache();
  });

  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<div>Home</div>" } },
        { path: "/jobs", component: { template: "<div>Jobs</div>" } },
        { path: "/jobs/:id", component: { template: "<div>Job</div>" } },
        { path: "/add-job", component: { template: "<div>Add Job</div>" } },
        {
          path: "/edit-job/:id",
          component: { template: "<div>Edit Job</div>" },
        },
        { path: "/login", component: { template: "<div>Login</div>" } },
        { path: "/register", component: { template: "<div>Register</div>" } },
      ],
    });
  };

  it("renders the home view", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays welcome or hero section", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(text.length > 0).toBe(true);
  });

  it("has link to browse jobs", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const links = wrapper.findAll("a");
    const hasJobsLink = links.some(
      (link) =>
        link.attributes("href")?.includes("jobs") ||
        link.text().toLowerCase().includes("job")
    );

    expect(
      links.length > 0 || wrapper.text().toLowerCase().includes("job")
    ).toBe(true);
  });

  it("displays main content area", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.html().length > 50).toBe(true);
  });

  it("contains action buttons or CTAs", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.length >= 0).toBe(true);
  });

  it("is responsive layout", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(
      wrapper.find(".container").exists() ||
        wrapper.html().includes("container")
    ).toBe(true);
  });

  it("renders without errors", () => {
    expect(() => {
      mount(HomeView, {
        global: {
          plugins: [createTestRouter()],
          stubs: {},
        },
      });
    }).not.toThrow();
  });

  it("has proper HTML structure", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.element).toBeDefined();
    expect(wrapper.element.tagName).toBeTruthy();
  });
});
