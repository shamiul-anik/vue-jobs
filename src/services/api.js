const API_BASE_URL = "/api/jobs";

export const jobsAPI = {
  // Get all jobs
  async getAllJobs() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  },

  // Get single job by ID
  async getJob(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch job");
    return response.json();
  },

  // Create new job
  async createJob(jobData) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error("Failed to create job");
      error.data = errorData;
      throw error;
    }
    return response.json();
  },

  // Update job
  async updateJob(id, jobData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error("Failed to update job");
      error.data = errorData;
      throw error;
    }
    return response.json();
  },

  // Delete job
  async deleteJob(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete job");
    return response.json();
  },
};
