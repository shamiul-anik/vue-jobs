const API_BASE_URL = "/api/jobs";

export interface JobInput {
  type: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  company_name: string;
  company_description?: string;
  contact_email: string;
  contact_phone?: string;
}

export interface Job extends JobInput {
  id: number;
  created_at?: string;
}

interface APIError extends Error {
  data?: Record<string, any>;
}

export const jobsAPI = {
  // Get all jobs
  async getAllJobs(): Promise<Job[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  },

  // Get single job by ID
  async getJob(id: number | string): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch job");
    return response.json();
  },

  // Create new job
  async createJob(jobData: JobInput): Promise<Record<string, any>> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error("Failed to create job") as APIError;
      error.data = errorData;
      throw error;
    }
    return response.json();
  },

  // Update job
  async updateJob(
    id: number | string,
    jobData: Partial<JobInput>
  ): Promise<Record<string, any>> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error("Failed to update job") as APIError;
      error.data = errorData;
      throw error;
    }
    return response.json();
  },

  // Delete job
  async deleteJob(id: number | string): Promise<Record<string, any>> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete job");
    return response.json();
  },
};
