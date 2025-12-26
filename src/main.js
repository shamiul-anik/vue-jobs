import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles.css";

let posthog;

(async () => {
  const module = await import("posthog-js");
  posthog = module.default;

  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_performance: true,
  });
})();

const app = createApp(App);

// Global Error Handler for PostHog
app.config.errorHandler = (err, instance, info) => {
  setTimeout(() => {
    posthog?.captureException(err, {
      info,
      component: instance?.$options?.name || "unnamed-component",
    });
  }, 0);

  console.error("Error Captured by PostHog:", err);
};

app.use(router);
app.mount("#app");
