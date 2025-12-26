import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { jobsAPI } from "../api.js";
import httpClient from "../httpClient.js";

// Mock httpClient
vi.mock("../httpClient.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Jobs API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllJobs", () => {
    it("should fetch all jobs successfully", async () => {
      const mockJobs = [
        { id: 1, title: "Senior Developer", salary: "$100K" },
        { id: 2, title: "Junior Developer", salary: "$60K" },
      ];

      httpClient.get.mockResolvedValueOnce(mockJobs);

      const result = await jobsAPI.getAllJobs();

      expect(httpClient.get).toHaveBeenCalledWith("/api/jobs");
      expect(result).toEqual(mockJobs);
    });

    it("should throw error when fetch fails", async () => {
      httpClient.get.mockRejectedValueOnce(new Error("Failed to fetch jobs"));

      await expect(jobsAPI.getAllJobs()).rejects.toThrow(
        "Failed to fetch jobs"
      );
    });
  });

  describe("getJob", () => {
    it("should fetch a single job by ID", async () => {
      const mockJob = { id: 1, title: "Senior Developer", salary: "$100K" };

      httpClient.get.mockResolvedValueOnce(mockJob);

      const result = await jobsAPI.getJob(1);

      expect(httpClient.get).toHaveBeenCalledWith("/api/jobs/1");
      expect(result).toEqual(mockJob);
    });

    it("should throw error when job not found", async () => {
      httpClient.get.mockRejectedValueOnce(new Error("Failed to fetch job"));

      await expect(jobsAPI.getJob(999)).rejects.toThrow("Failed to fetch job");
    });
  });

  describe("createJob", () => {
    it("should create a new job successfully", async () => {
      const newJob = {
        title: "New Position",
        description: "A great opportunity",
        salary: "$80K",
        location: "New York",
        company_name: "Tech Corp",
        contact_email: "hr@techcorp.com",
      };

      const response = { id: 3, ...newJob };

      httpClient.post.mockResolvedValueOnce(response);

      const result = await jobsAPI.createJob(newJob);

      expect(httpClient.post).toHaveBeenCalledWith("/api/jobs", newJob);
      expect(result).toEqual(response);
    });

    it("should throw error with response data on creation failure", async () => {
      const newJob = { title: "Invalid Job" };
      const error = new Error("Failed to create job");
      const errorData = { errors: [{ msg: "Title required" }] };
      error.data = errorData;

      httpClient.post.mockRejectedValueOnce(error);

      try {
        await jobsAPI.createJob(newJob);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).toBe("Failed to create job");
        expect(err.data).toEqual(errorData);
      }
    });
  });

  describe("updateJob", () => {
    it("should update a job successfully", async () => {
      const jobData = { title: "Updated Position", salary: "$90K" };
      const response = { id: 1, ...jobData };

      httpClient.put.mockResolvedValueOnce(response);

      const result = await jobsAPI.updateJob(1, jobData);

      expect(httpClient.put).toHaveBeenCalledWith("/api/jobs/1", jobData);
      expect(result).toEqual(response);
    });

    it("should throw error when update fails", async () => {
      const jobData = { title: "Updated" };
      const error = new Error("Failed to update job");
      const errorData = { error: "Job not found" };
      error.data = errorData;

      httpClient.put.mockRejectedValueOnce(error);

      try {
        await jobsAPI.updateJob(999, jobData);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).toBe("Failed to update job");
        expect(err.data).toEqual(errorData);
      }
    });
  });

  describe("deleteJob", () => {
    it("should delete a job successfully", async () => {
      const response = { message: "Job deleted" };
      httpClient.delete.mockResolvedValueOnce(response);

      const result = await jobsAPI.deleteJob(1);

      expect(httpClient.delete).toHaveBeenCalledWith("/api/jobs/1");
      expect(result).toEqual(response);
    });

    it("should throw error when delete fails", async () => {
      httpClient.delete.mockRejectedValueOnce(
        new Error("Failed to delete job")
      );

      await expect(jobsAPI.deleteJob(999)).rejects.toThrow(
        "Failed to delete job"
      );
    });
  });
});
