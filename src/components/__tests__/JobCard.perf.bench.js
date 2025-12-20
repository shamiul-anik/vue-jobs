import { describe, bench } from "vitest";
import { mount } from "@vue/test-utils";
import JobCard from "../JobCard.vue";

const mockJob = {
  id: 1,
  title: "Senior Vue Developer",
  type: "Full-Time",
  salary: "$100K - $120K",
  location: "San Francisco, CA",
  company_name: "Tech Corp",
  created_at: "2025-12-20T10:00:00Z",
};

describe("JobCard Performance Benchmarks", () => {
  bench("render single JobCard", () => {
    mount(JobCard, {
      props: { job: mockJob },
      global: {
        stubs: {},
      },
    });
  });

  bench("render 10 JobCards", () => {
    const jobs = Array(10)
      .fill(null)
      .map((_, i) => ({
        ...mockJob,
        id: i,
      }));

    mount({
      template: `
        <div>
          <JobCard v-for="job in jobs" :key="job.id" :job="job" />
        </div>
      `,
      components: { JobCard },
      data: () => ({ jobs }),
      global: {
        stubs: {},
      },
    });
  });

  bench("render 50 JobCards", () => {
    const jobs = Array(50)
      .fill(null)
      .map((_, i) => ({
        ...mockJob,
        id: i,
      }));

    mount({
      template: `
        <div>
          <JobCard v-for="job in jobs" :key="job.id" :job="job" />
        </div>
      `,
      components: { JobCard },
      data: () => ({ jobs }),
      global: {
        stubs: {},
      },
    });
  });

  bench("update JobCard props", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        stubs: {},
      },
    });

    for (let i = 0; i < 10; i++) {
      wrapper.props("job", {
        ...mockJob,
        title: `Updated Title ${i}`,
        salary: `$${80 + i}K - $${120 + i}K`,
      });
    }
  });

  bench("toggle component visibility", () => {
    const wrapper = mount({
      template: `<JobCard v-if="visible" :job="job" />`,
      components: { JobCard },
      data: () => ({ visible: true, job: mockJob }),
      global: {
        stubs: {},
      },
    });

    for (let i = 0; i < 10; i++) {
      wrapper.vm.visible = !wrapper.vm.visible;
    }
  });
});
