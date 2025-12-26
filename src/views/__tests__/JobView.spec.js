import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import JobView from "../JobView.vue";
import { useJobs, state as jobsState } from "../../composables/useJobs";

// Mock the API
vi.mock("../../services/api.js", () => ({
  jobsAPI: {
    getJob: vi.fn((id) =>
      Promise.resolve({
        id: parseInt(id),
        title: "Senior Vue Developer",
        type: "Full-Time",
        description: "Experienced Vue.js developer needed",
        salary: "$100K",
        location: "San Francisco",
        company_name: "Tech Corp",
        company_description: "Leading tech company",
        contact_email: "hr@techcorp.com",
        created_at: "2025-12-20T10:00:00Z",
      })
    ),
    deleteJob: vi.fn(),
  },
}));

// Mock useSEO and useAuth
vi.mock("../../composables/useSEO.js", () => ({
  useSEO: vi.fn(() => ({ updateMetaTags: vi.fn() })),
}));

vi.mock("../../composables/useAuth.js", () => ({
  useAuth: vi.fn(() => ({
    user: { value: { role: "admin" } },
    isAuthenticated: { value: true },
  })),
}));

// Mock vue-router hooks at module level
vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRoute: vi.fn(() => ({ params: { id: "1" } })),
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    RouterLink: {
      template: "<a><slot /></a>",
      props: ["to"],
    },
  };
});

describe("JobView.vue", () => {
  const { clearCache } = useJobs();

  beforeEach(() => {
    clearCache();
    vi.clearAllMocks();
    jobsState.loading = false;
    jobsState.error = null;
  });

  const mountComponent = () => {
    return mount(JobView, {
      global: {
        stubs: {
          Modal: true,
        },
      },
    });
  };

  it("renders the job view", () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it("displays loading state initially", async () => {
    jobsState.loading = true;
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain("Loading job details...");
  });

  it("displays job details after loading", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Senior Vue Developer");
  });

  it("displays job title (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("h1").text()).toBe("Senior Vue Developer");
  });

  it("displays job type (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Full-Time");
  });

  it("displays salary (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("$100K");
  });

  it("displays job description (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Experienced Vue.js developer needed");
  });

  it("displays location (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("San Francisco");
  });

  it("displays company name (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Tech Corp");
  });

  it("displays company description (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Leading tech company");
  });

  it("displays contact email (when loaded)", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("hr@techcorp.com");
  });

  it("has edit button for admin", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find('a[href*="/jobs/edit/1"]').exists() || wrapper.text()
    ).toContain("Edit Job");
  });

  it("has delete button for admin", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Delete Job");
  });
});
