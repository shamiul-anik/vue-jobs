import { reactive, computed } from "vue";
import { jobsAPI } from "../services/api";

// Global singleton state - exported for testing purposes if needed
export const state = reactive({
  homeJobs: [],
  allJobs: [],
  totalJobs: 0,
  jobDetails: {}, // Using a reactive object now
  loading: false,
  error: null,
  lastParams: null, // To check if we need to refetch allJobs
});

export function useJobs() {
  const fetchHomeJobs = async (force = false) => {
    // Cache check: if we already have homeJobs and aren't forcing a refresh
    if (state.homeJobs.length > 0 && !force) return;

    state.loading = true;
    state.error = null;
    try {
      const data = await jobsAPI.getAllJobs({ limit: 3 });
      state.homeJobs = data.jobs || data;
    } catch (err) {
      state.error = "Failed to load featured jobs.";
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const fetchAllJobs = async (params = {}, force = false) => {
    const paramsString = JSON.stringify(params);

    // Cache check: if params are same and we have data, skip unless forced
    if (state.allJobs.length > 0 && state.lastParams === paramsString && !force)
      return;

    state.loading = true;
    state.error = null;
    try {
      const data = await jobsAPI.getAllJobs(params);
      if (data.jobs) {
        state.allJobs = data.jobs;
        state.totalJobs = data.total;
      } else {
        state.allJobs = data;
        state.totalJobs = data.length;
      }
      state.lastParams = paramsString;
    } catch (err) {
      state.error = "Failed to load jobs.";
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const fetchJobById = async (id, force = false) => {
    // Cache check
    if (state.jobDetails[id] && !force) return state.jobDetails[id];

    state.loading = true;
    state.error = null;
    try {
      const job = await jobsAPI.getJob(id);
      state.jobDetails[id] = job;
      return job;
    } catch (err) {
      state.error = "Failed to load job details.";
      console.error(err);
      throw err;
    } finally {
      state.loading = false;
    }
  };

  // Mutations to keep state in sync when adding/editing/deleting
  const clearCache = () => {
    state.homeJobs = [];
    state.allJobs = [];
    state.jobDetails = {};
    state.lastParams = null;
  };

  return {
    // Read-only state
    homeJobs: computed(() => state.homeJobs),
    allJobs: computed(() => state.allJobs),
    totalJobs: computed(() => state.totalJobs),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    getJobDetails: (id) => computed(() => state.jobDetails[id] || {}),

    // Actions
    fetchHomeJobs,
    fetchAllJobs,
    fetchJobById,
    clearCache,
  };
}
