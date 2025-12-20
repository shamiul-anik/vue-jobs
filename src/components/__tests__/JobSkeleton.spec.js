import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import JobSkeleton from "../JobSkeleton.vue";

describe("JobSkeleton.vue", () => {
  it("renders correctly", () => {
    const wrapper = mount(JobSkeleton);
    expect(wrapper.exists()).toBe(true);
  });

  it("displays skeleton elements with animation classes", () => {
    const wrapper = mount(JobSkeleton);
    const animatePulse = wrapper.findAll(".animate-pulse");
    expect(animatePulse.length).toBeGreaterThan(0);
  });
});
