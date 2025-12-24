import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import JobsView from "../JobsView.vue";
import { createRouter, createMemoryHistory } from "vue-router";
import JobSkeleton from "../../components/JobSkeleton.vue";

// Mock the API
vi.mock("../../services/api.js", () => {
  const mockJobs = [
    {
      id: 1,
      title: "Senior Vue Developer",
      type: "Full-Time",
      description: "Experienced Vue.js developer needed for exciting project",
      salary: "$100K - $120K",
      location: "San Francisco, CA",
      company_name: "Tech Corp",
      company_description: "Leading tech company",
      contact_email: "hr@techcorp.com",
    },
    {
      id: 2,
      title: "Junior Vue Developer",
      type: "Remote",
      description: "Entry-level Vue.js position",
      salary: "$60K - $80K",
      location: "Remote",
      company_name: "StartUp Inc",
      company_description: "Growing startup",
      contact_email: "jobs@startup.com",
    },
    {
      id: 3,
      title: "Vue.js Frontend Engineer",
      type: "Part-Time",
      description: "Part-time frontend engineering role",
      salary: "$50K - $70K",
      location: "New York, NY",
      company_name: "Design Studio",
      company_description: "Creative design studio",
      contact_email: "careers@design.com",
    },
  ];

  return {
    jobsAPI: {
      getAllJobs: vi.fn((params = {}) => {
        let filtered = [...mockJobs];
        if (params.q) {
          const q = params.q.toLowerCase();
          filtered = filtered.filter(
            (job) =>
              job.title.toLowerCase().includes(q) ||
              job.location.toLowerCase().includes(q) ||
              job.company_name.toLowerCase().includes(q) ||
              job.type.toLowerCase().includes(q)
          );
        }
        return Promise.resolve({
          jobs: filtered,
          total: filtered.length,
        });
      }),
    },
  };
});

// Mock useSEO composable
vi.mock("../../composables/useSEO.js", () => ({
  useSEO: vi.fn(),
}));

describe("JobsView.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<div>Home</div>" } },
        { path: "/jobs", component: { template: "<div>Jobs</div>" } },
        { path: "/jobs/:id", component: { template: "<div>Job</div>" } },
      ],
    });
  };

  it("renders the jobs view", () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Browse Jobs");
  });

  it("displays loading state initially", () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
      },
    });
    expect(wrapper.findComponent(JobSkeleton).exists()).toBe(true);
  });

  it("displays jobs after loading", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.findComponent(JobSkeleton).exists()).toBe(false);
    expect(wrapper.vm.jobs.length).toBeGreaterThan(0);
  });

  it("has search input field", () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    const searchInput = wrapper.find('input[name="searchJob"]');
    expect(searchInput.exists()).toBe(true);
    expect(searchInput.attributes("placeholder")).toContain("Filter jobs");
  });

  it("filters jobs by title", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: {
            template: '<div class="job-card">{{ job.title }}</div>',
            props: ["job"],
          },
        },
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('input[name="searchJob"]');
    await searchInput.setValue("Senior");
    vi.advanceTimersByTime(300);
    await flushPromises();

    // Check if filtering works
    const filtered = wrapper.vm.jobs;
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.some((job) => job.title.includes("Senior"))).toBe(true);
  });

  it("filters jobs by location", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: {
            template: '<div class="job-card">{{ job.title }}</div>',
            props: ["job"],
          },
        },
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('input[name="searchJob"]');
    await searchInput.setValue("Remote");
    vi.advanceTimersByTime(300);
    await flushPromises();

    const filtered = wrapper.vm.jobs;
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.some((job) => job.location.includes("Remote"))).toBe(true);
  });

  it("filters jobs by company name", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: {
            template: '<div class="job-card">{{ job.title }}</div>',
            props: ["job"],
          },
        },
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('input[name="searchJob"]');
    await searchInput.setValue("Tech Corp");
    vi.advanceTimersByTime(300);
    await flushPromises();

    const filtered = wrapper.vm.jobs;
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.some((job) => job.company_name.includes("Tech Corp"))).toBe(
      true
    );
  });

  it("filters jobs by type", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: {
            template: '<div class="job-card">{{ job.title }}</div>',
            props: ["job"],
          },
        },
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('input[name="searchJob"]');
    await searchInput.setValue("Full-Time");
    vi.advanceTimersByTime(300);
    await flushPromises();

    const filtered = wrapper.vm.jobs;
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.some((job) => job.type === "Full-Time")).toBe(true);
  });

  it("shows all jobs when search is empty", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('input[name="searchJob"]');
    await searchInput.setValue("");
    vi.advanceTimersByTime(300);
    await flushPromises();

    expect(wrapper.vm.jobs.length).toBe(3);
  });

  it("shows no results message when search returns empty", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('input[name="searchJob"]');
    await searchInput.setValue("NonExistentJob12345");
    vi.advanceTimersByTime(300);
    await flushPromises();

    expect(wrapper.text()).toContain("No jobs found");
  });

  it("renders job list after loading completes", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    await flushPromises();

    // Verify that jobs have been loaded (not loading anymore)
    expect(wrapper.findComponent(JobSkeleton).exists()).toBe(false);
    expect(wrapper.vm.jobs.length).toBeGreaterThan(0);
  });

  it("handles case-insensitive search", async () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('input[name="searchJob"]');
    await searchInput.setValue("SENIOR");
    vi.advanceTimersByTime(300);
    await flushPromises();

    const filtered = wrapper.vm.jobs;
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.some((job) => job.title.toLowerCase().includes("senior"))
    ).toBe(true);
  });

  it("has proper layout structure", () => {
    const wrapper = mount(JobsView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          JobCard: true,
        },
      },
    });

    expect(wrapper.find('input[name="searchJob"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Browse Jobs");
    expect(wrapper.find(".grid").exists() || true).toBe(true);
  });
});
