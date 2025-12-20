import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import JobCard from "../JobCard.vue";
import { createRouter, createMemoryHistory } from "vue-router";

describe("JobCard.vue", () => {
  const mockJob = {
    id: 1,
    title: "Senior Vue Developer",
    type: "Full-Time",
    description:
      "We are seeking a talented Front-End Developer with expertise in Vue.js and modern web development practices. This is a great opportunity to work with cutting-edge technologies.",
    salary: "$70K - $80K / Year",
    location: "Boston, MA",
    company_name: "Tech Corp",
    contact_email: "hr@techcorp.com",
    created_at: "2025-12-20T10:00:00Z",
  };

  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<div>Home</div>" } },
        { path: "/jobs/:id", component: { template: "<div>Job</div>" } },
      ],
    });
  };

  it("renders job card component", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [createTestRouter()],
        stubs: {
          RouterLink: false,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".bg-gray-50").exists()).toBe(true);
  });

  it("displays job title", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [createTestRouter()],
        stubs: {
          RouterLink: false,
          i: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Senior Vue Developer");
  });

  it("displays job type", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [createTestRouter()],
        stubs: {
          RouterLink: false,
          i: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Full-Time");
  });

  it("displays salary information", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [createTestRouter()],
        stubs: {
          RouterLink: false,
          i: true,
        },
      },
    });

    expect(wrapper.text()).toContain("$70K - $80K / Year");
  });

  it("displays job location", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [createTestRouter()],
        stubs: {
          RouterLink: false,
          i: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Boston, MA");
  });

  it("handles different job types", () => {
    const jobTypes = [
      "Full-Time",
      "Part-Time",
      "Remote",
      "Internship",
      "Contract",
    ];

    jobTypes.forEach((type) => {
      const jobWithType = { ...mockJob, type };

      const wrapper = mount(JobCard, {
        props: { job: jobWithType },
        global: {
          plugins: [createTestRouter()],
          stubs: {
            RouterLink: false,
            i: true,
          },
        },
      });

      expect(wrapper.text()).toContain(type);
    });
  });
});
