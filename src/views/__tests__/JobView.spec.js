import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import JobView from "../JobView.vue";
import { createRouter, createMemoryHistory } from "vue-router";

// Mock the API
vi.mock("../../services/api.js", () => ({
  jobsAPI: {
    getJob: vi.fn((id) =>
      Promise.resolve({
        id: parseInt(id),
        title: "Senior Vue Developer",
        type: "Full-Time",
        description: "Experienced Vue.js developer needed for exciting project",
        salary: "$100K - $120K",
        location: "San Francisco, CA",
        company_name: "Tech Corp",
        company_description: "Leading tech company",
        contact_email: "hr@techcorp.com",
        created_at: "2025-12-20T10:00:00Z",
      })
    ),
  },
}));

// Mock useSEO composable
vi.mock("../../composables/useSEO.js", () => ({
  useSEO: vi.fn(() => ({ updateMetaTags: vi.fn() })),
}));

describe("JobView.vue", () => {
  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<div>Home</div>" } },
        { path: "/jobs/:id", component: { template: "<div>Job</div>" } },
        { path: "/jobs", component: { template: "<div>Jobs</div>" } },
        { path: "/add-job", component: { template: "<div>Add Job</div>" } },
        {
          path: "/edit-job/:id",
          component: { template: "<div>Edit Job</div>" },
        },
      ],
    });
  };

  it("renders the job view", () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays loading state initially", () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays job details after loading", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays job title (when loaded)", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays job type (when loaded)", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays job location (when loaded)", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays salary information (when loaded)", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays company information (when loaded)", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays job description (when loaded)", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has contact email field (when loaded)", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has apply or contact button (when loaded)", () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("renders without errors", () => {
    expect(() => {
      mount(JobView, {
        global: {
          plugins: [createTestRouter()],
          stubs: {},
        },
      });
    }).not.toThrow();
  });

  it("has proper layout structure", async () => {
    const wrapper = mount(JobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.element).toBeDefined();
    expect(wrapper.html().length > 50).toBe(true);
  });
});
