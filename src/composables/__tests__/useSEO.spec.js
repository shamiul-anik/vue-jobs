import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSEO } from "../useSEO";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

describe("useSEO composable", () => {
  beforeEach(() => {
    document.title = "";
    document.head.innerHTML = "";
    vi.clearAllMocks();
  });

  const TestComponent = defineComponent({
    props: ["seoData"],
    setup(props) {
      useSEO(props.seoData);
      return () => null;
    },
  });

  it("updates document title", () => {
    mount(TestComponent, {
      props: {
        seoData: { title: "Test Title" },
      },
    });

    expect(document.title).toBe("Test Title");
  });

  it("adds description meta tag", () => {
    mount(TestComponent, {
      props: {
        seoData: {
          title: "Title",
          description: "This is a description",
        },
      },
    });

    const meta = document.querySelector('meta[name="description"]');
    expect(meta.getAttribute("content")).toBe("This is a description");
  });

  it("adds canonical link tag", () => {
    mount(TestComponent, {
      props: {
        seoData: {
          title: "Title",
          canonical: "https://example.com",
        },
      },
    });

    const link = document.querySelector('link[rel="canonical"]');
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  it("adds Open Graph meta tags", () => {
    mount(TestComponent, {
      props: {
        seoData: {
          title: "OG Title",
          description: "OG Description",
        },
      },
    });

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle.getAttribute("content")).toBe("OG Title");
  });
});
