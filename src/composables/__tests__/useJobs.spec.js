import { describe, it, expect, vi, beforeEach } from "vitest";
import { useJobs, state } from "../useJobs";
import { jobsAPI } from "../../services/api";

// Mock the API service
vi.mock("../../services/api", () => ({
  jobsAPI: {
    getAllJobs: vi.fn(),
    getJob: vi.fn(),
  },
}));

describe("useJobs Composable", () => {
  beforeEach(() => {
    // Reset state and mocks before each test
    const { clearCache } = useJobs();
    clearCache();
    vi.clearAllMocks();
  });

  it("fetchHomeJobs updates state with data", async () => {
    const mockJobs = [{ id: 1, title: "Job 1" }];
    jobsAPI.getAllJobs.mockResolvedValue(mockJobs);

    const { fetchHomeJobs, homeJobs } = useJobs();

    await fetchHomeJobs();

    expect(state.loading).toBe(false);
    expect(homeJobs.value).toEqual(mockJobs);
    expect(jobsAPI.getAllJobs).toHaveBeenCalledWith({ limit: 3 });
  });

  it("fetchHomeJobs uses cache on second call", async () => {
    const mockJobs = [{ id: 1, title: "Job 1" }];
    jobsAPI.getAllJobs.mockResolvedValue(mockJobs);

    const { fetchHomeJobs } = useJobs();

    // First call
    await fetchHomeJobs();
    expect(jobsAPI.getAllJobs).toHaveBeenCalledTimes(1);

    // Second call - should not hit API
    await fetchHomeJobs();
    expect(jobsAPI.getAllJobs).toHaveBeenCalledTimes(1);

    // Force refresh
    await fetchHomeJobs(true);
    expect(jobsAPI.getAllJobs).toHaveBeenCalledTimes(2);
  });

  it("fetchAllJobs updates state correctly", async () => {
    const mockResponse = { jobs: [{ id: 1, title: "Job 1" }], total: 1 };
    jobsAPI.getAllJobs.mockResolvedValue(mockResponse);

    const { fetchAllJobs, allJobs, totalJobs } = useJobs();

    await fetchAllJobs({ limit: 10 });

    expect(allJobs.value).toEqual(mockResponse.jobs);
    expect(totalJobs.value).toBe(1);
    expect(jobsAPI.getAllJobs).toHaveBeenCalledWith({ limit: 10 });
  });

  it("fetchJobById caches individual jobs", async () => {
    const mockJob = { id: 123, title: "Specific Job" };
    jobsAPI.getJob.mockResolvedValue(mockJob);

    const { fetchJobById, getJobDetails } = useJobs();

    // First fetch
    await fetchJobById(123);
    expect(jobsAPI.getJob).toHaveBeenCalledWith(123);
    expect(getJobDetails(123).value).toEqual(mockJob);

    // Second fetch - should be cached
    await fetchJobById(123);
    expect(jobsAPI.getJob).toHaveBeenCalledTimes(1);
  });

  it("handles errors correctly", async () => {
    // Spy on console.error to suppress the expected error log
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const errorMsg = "Network Error";
    jobsAPI.getAllJobs.mockRejectedValue(new Error(errorMsg));

    const { fetchHomeJobs, error } = useJobs();

    await fetchHomeJobs();

    expect(state.loading).toBe(false);
    expect(error.value).toBe("Failed to load featured jobs.");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
