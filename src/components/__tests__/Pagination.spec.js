import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Pagination from "../Pagination.vue";

describe("Pagination.vue", () => {
  it("renders correct number of pages", () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const buttons = wrapper
      .findAll("button")
      .filter(
        (b) => !b.text().includes("Previous") && !b.text().includes("Next")
      );
    expect(buttons.length).toBe(5);
  });

  it("disables previous button on first page", () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const prevButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Previous"));
    expect(prevButton.element.disabled).toBe(true);
  });

  it("disables next button on last page", () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 5,
        totalPages: 5,
      },
    });

    const nextButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Next"));
    expect(nextButton.element.disabled).toBe(true);
  });

  it("emits change-page event when a page is clicked", async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const page2Button = wrapper.findAll("button").find((b) => b.text() === "2");
    await page2Button.trigger("click");

    expect(wrapper.emitted("change-page")).toBeTruthy();
    expect(wrapper.emitted("change-page")[0]).toEqual([2]);
  });

  it("shows ellipses for many pages", () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 10,
      },
    });

    expect(wrapper.text()).toContain("...");
  });
});
