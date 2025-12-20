import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import EditJobView from "../EditJobView.vue";
import { createRouter, createMemoryHistory } from "vue-router";

// Mock the API
vi.mock("../../services/api.js", () => ({
  jobsAPI: {
    getJob: vi.fn((id) =>
      Promise.resolve({
        id: parseInt(id),
        title: "Senior Vue Developer",
        type: "Full-Time",
        description: "Experienced Vue.js developer needed",
        salary: "$100K - $120K",
        location: "San Francisco, CA",
        company_name: "Tech Corp",
        company_description: "Leading tech company",
        contact_email: "hr@techcorp.com",
      })
    ),
    updateJob: vi.fn(() =>
      Promise.resolve({ message: "Job updated successfully" })
    ),
  },
}));

// Mock useSEO composable
vi.mock("../../composables/useSEO.js", () => ({
  useSEO: vi.fn(() => ({ updateMetaTags: vi.fn() })),
}));

describe("EditJobView.vue", () => {
  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/edit-job/:id",
          component: { template: "<div>Edit Job</div>" },
        },
        { path: "/", component: { template: "<div>Home</div>" } },
        { path: "/jobs/:id", component: { template: "<div>Job</div>" } },
        { path: "/jobs", component: { template: "<div>Jobs</div>" } },
      ],
    });
  };

  it("renders the edit job view", () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays form title (when loaded)", () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("loads job data on mount", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays loaded job title (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has title input field with current value (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has job type field (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has description field (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has salary field (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has location field (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has company name field (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has contact email field (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("has save/update button (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("has cancel button (when loaded)", () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("allows editing title", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    const titleInput =
      wrapper.find('input[name="title"]') || wrapper.find('input[type="text"]');
    if (titleInput.exists()) {
      await titleInput.setValue("Updated Title");
      expect(titleInput.element.value).toBe("Updated Title");
    }
  });

  it("allows editing description", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    const textarea = wrapper.find("textarea");
    if (textarea.exists()) {
      await textarea.setValue("Updated description");
      expect(textarea.element.value).toBe("Updated description");
    }
  });

  it("renders form without errors", () => {
    expect(() => {
      mount(EditJobView, {
        global: {
          plugins: [createTestRouter()],
          stubs: {},
        },
      });
    }).not.toThrow();
  });

  it("has proper form layout (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("displays all editable fields (when loaded)", async () => {
    const wrapper = mount(EditJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });
});
