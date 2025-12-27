import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Contact from "../Contact.vue";

describe("Contact.vue", () => {
  it("renders the contact form correctly", () => {
    const wrapper = mount(Contact);
    expect(wrapper.find("h2").text()).toBe("Get In Touch");
    expect(wrapper.find('input[type="text"]').exists()).toBe(true); // Name
    expect(wrapper.find('input[type="email"]').exists()).toBe(true); // Email
    expect(wrapper.find("select").exists()).toBe(true); // Subject
    expect(wrapper.find("textarea").exists()).toBe(true); // Message
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("initial state is idle", () => {
    const wrapper = mount(Contact);
    const button = wrapper.find('button[type="submit"]');
    expect(button.text()).toContain("Send Message");
    expect(button.attributes("disabled")).toBeUndefined();
  });

  it("transitions to sending state on submit", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Contact);

    // Fill out form with valid data
    await wrapper.find('input[type="text"]').setValue("John Doe");
    await wrapper.find('input[type="email"]').setValue("john@example.com");
    await wrapper.find("select").setValue("Job Inquiry");
    await wrapper
      .find("textarea")
      .setValue("This is a message longer than 10 characters.");

    await wrapper.find("form").trigger("submit.prevent");

    const button = wrapper.find('button[type="submit"]');
    expect(wrapper.vm.status).toBe("sending");
    expect(button.text()).toContain("Sending...");
    expect(button.attributes("disabled")).toBe(""); // disabled attribute is present

    vi.useRealTimers();
  });

  it("shows success message after simulation", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Contact);

    // Fill out form with valid data
    await wrapper.find('input[type="text"]').setValue("John Doe");
    await wrapper.find('input[type="email"]').setValue("john@example.com");
    await wrapper.find("select").setValue("Job Inquiry");
    await wrapper
      .find("textarea")
      .setValue("This is a message longer than 10 characters.");

    await wrapper.find("form").trigger("submit.prevent");

    // Fast-forward time to simulate API completion
    await vi.advanceTimersByTimeAsync(2000);

    const button = wrapper.find('button[type="submit"]');
    expect(wrapper.vm.status).toBe("success");
    expect(button.text()).toContain("Message Sent!");

    vi.useRealTimers();
  });
});
