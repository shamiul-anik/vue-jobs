import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles.css";
import posthog from "posthog-js";

const app = createApp(App);

// Initialize PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  person_profiles: "identified_only",
  capture_performance: true,
});

// Global Error Handler for PostHog
app.config.errorHandler = (err, instance, info) => {
  posthog.captureException(err, {
    info,
    component: instance?.$options?.name || "unnamed-component",
  });
  console.error("Error Captured by PostHog:", err);
};

app.use(router);
app.mount("#app");
