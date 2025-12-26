import httpClient from "./httpClient";

const API_BASE_URL = "/api/jobs";

export const jobsAPI = {
  // Get all jobs with optional pagination/limit
  async getAllJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE_URL}?${query}` : API_BASE_URL;
    return httpClient.get(url);
  },

  // Get single job by ID
  async getJob(id) {
    return httpClient.get(`${API_BASE_URL}/${id}`);
  },

  // Create new job
  async createJob(jobData) {
    return httpClient.post(API_BASE_URL, jobData);
  },

  // Update job
  async updateJob(id, jobData) {
    return httpClient.put(`${API_BASE_URL}/${id}`, jobData);
  },

  // Delete job
  async deleteJob(id) {
    return httpClient.delete(`${API_BASE_URL}/${id}`);
  },
};
