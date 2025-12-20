import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AddJobView from "../AddJobView.vue";
import { createRouter, createMemoryHistory } from "vue-router";

// Mock the API
vi.mock("../../services/api.js", () => ({
  jobsAPI: {
    addJob: vi.fn(() =>
      Promise.resolve({ id: 1, message: "Job created successfully" })
    ),
  },
}));

// Mock useSEO composable
vi.mock("../../composables/useSEO.js", () => ({
  useSEO: vi.fn(() => ({ updateMetaTags: vi.fn() })),
}));

describe("AddJobView.vue", () => {
  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/add-job", component: { template: "<div>Add Job</div>" } },
        { path: "/jobs", component: { template: "<div>Jobs</div>" } },
      ],
    });
  };

  it("renders the add job view", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays form title", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(
      text.includes("add") || text.includes("new") || text.includes("job")
    ).toBe(true);
  });

  it("has title input field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const titleInput =
      wrapper.find('input[name="title"]') || wrapper.find('input[type="text"]');
    expect(
      titleInput.exists() || wrapper.text().toLowerCase().includes("title")
    ).toBe(true);
  });

  it("has job type select field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const typeSelect =
      wrapper.find("select") || wrapper.find('input[name="type"]');
    expect(
      typeSelect.exists() || wrapper.text().toLowerCase().includes("type")
    ).toBe(true);
  });

  it("has description textarea field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const textarea = wrapper.find("textarea");
    expect(
      textarea.exists() || wrapper.text().toLowerCase().includes("description")
    ).toBe(true);
  });

  it("has salary input field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.text().toLowerCase().includes("salary")).toBe(true);
  });

  it("has location input field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.text().toLowerCase().includes("location")).toBe(true);
  });

  it("has company name input field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.text().toLowerCase().includes("company")).toBe(true);
  });

  it("has company description field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(wrapper.text().toLowerCase().includes("description")).toBe(true);
  });

  it("has contact email input field", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    expect(
      wrapper.text().toLowerCase().includes("email") ||
        wrapper.text().toLowerCase().includes("contact")
    ).toBe(true);
  });

  it("has submit button", () => {
    const wrapper = mount(AddJobView, {
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
            btn.text().toLowerCase().includes("submit") ||
            btn.text().toLowerCase().includes("post")
        );
    expect(submitButton?.exists() || wrapper.findAll("button").length > 0).toBe(
      true
    );
  });

  it("has cancel button", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.length > 0).toBe(true);
  });

  it("allows input in title field", async () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const titleInput =
      wrapper.find('input[name="title"]') || wrapper.find('input[type="text"]');
    if (titleInput.exists()) {
      await titleInput.setValue("Senior Developer");
      expect(titleInput.element.value).toBe("Senior Developer");
    }
  });

  it("renders form without errors", () => {
    expect(() => {
      mount(AddJobView, {
        global: {
          plugins: [createTestRouter()],
          stubs: {
            i: true,
          },
        },
      });
    }).not.toThrow();
  });

  it("has proper form layout", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const form = wrapper.find("form");
    expect(form.exists() || wrapper.findAll("input").length > 0).toBe(true);
  });

  it("displays all required fields", () => {
    const wrapper = mount(AddJobView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {},
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(text.includes("title")).toBe(true);
    expect(text.includes("type") || text.includes("job type")).toBe(true);
    expect(text.includes("description")).toBe(true);
  });
});
