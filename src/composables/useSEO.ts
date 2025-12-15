import { onMounted, watch, Ref } from "vue";

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
}

/**
 * Composable for managing SEO meta tags dynamically
 * @param {Object} seoData - SEO configuration object
 */
export function useSEO(seoData: SEOData | Ref<SEOData>) {
  const updateMetaTags = () => {
    const data =
      (seoData as Ref<SEOData>).value || (seoData as SEOData);

    // Update title
    if (data.title) {
      document.title = data.title;
    }

    // Update or create meta tags
    const metaTags: Array<{
      name?: string;
      property?: string;
      content?: string;
    }> = [
      { name: "description", content: data.description },
      { name: "keywords", content: data.keywords },
      { property: "og:title", content: data.title },
      { property: "og:description", content: data.description },
      { property: "og:url", content: data.url || window.location.href },
      { property: "og:image", content: data.image },
      { property: "twitter:title", content: data.title },
      { property: "twitter:description", content: data.description },
      { property: "twitter:image", content: data.image },
    ];

    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;

      const selector = name
        ? `meta[name="${name}"]`
        : `meta[property="${property}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;

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
    if (data.canonical) {
      let canonical = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (canonical) {
        canonical.setAttribute("href", data.canonical);
      } else {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        canonical.setAttribute("href", data.canonical);
        document.head.appendChild(canonical);
      }
    }

    // Update structured data
    if (data.structuredData) {
      let script = document.querySelector(
        'script[type="application/ld+json"]'
      ) as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data.structuredData);
    }
  };

  onMounted(() => {
    updateMetaTags();
  });

  // Watch for changes in seoData if it's reactive
  if ((seoData as Ref<SEOData>).value) {
    watch(seoData, updateMetaTags, { deep: true });
  }

  return {
    updateMetaTags,
  };
}
