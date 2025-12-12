import { onMounted, watch } from "vue";

/**
 * Composable for managing SEO meta tags dynamically
 * @param {Object} seoData - SEO configuration object
 */
export function useSEO(seoData) {
  const updateMetaTags = () => {
    // Update title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update or create meta tags
    const metaTags = [
      { name: "description", content: seoData.description },
      { name: "keywords", content: seoData.keywords },
      { property: "og:title", content: seoData.title },
      { property: "og:description", content: seoData.description },
      { property: "og:url", content: seoData.url || window.location.href },
      { property: "og:image", content: seoData.image },
      { property: "twitter:title", content: seoData.title },
      { property: "twitter:description", content: seoData.description },
      { property: "twitter:image", content: seoData.image },
    ];

    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;

      const selector = name
        ? `meta[name="${name}"]`
        : `meta[property="${property}"]`;
      let element = document.querySelector(selector);

      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        if (name) element.setAttribute("name", name);
        if (property) element.setAttribute("property", property);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    });

    // Update canonical URL
    if (seoData.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", seoData.canonical);
      } else {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        canonical.setAttribute("href", seoData.canonical);
        document.head.appendChild(canonical);
      }
    }

    // Update structured data
    if (seoData.structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(seoData.structuredData);
    }
  };

  onMounted(() => {
    updateMetaTags();
  });

  // Watch for changes in seoData if it's reactive
  if (seoData.value) {
    watch(seoData, updateMetaTags, { deep: true });
  }

  return {
    updateMetaTags,
  };
}
