import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { jobsAPI } from '../api.js';

// Mock fetch
global.fetch = vi.fn();

describe('Jobs API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    fetch.mockReset();
  });

  describe('getAllJobs', () => {
    it('should fetch all jobs successfully', async () => {
      const mockJobs = [
        { id: 1, title: 'Senior Developer', salary: '$100K' },
        { id: 2, title: 'Junior Developer', salary: '$60K' },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobs,
      });

      const result = await jobsAPI.getAllJobs();

      expect(fetch).toHaveBeenCalledWith('/api/jobs');
      expect(result).toEqual(mockJobs);
    });

    it('should throw error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(jobsAPI.getAllJobs()).rejects.toThrow('Failed to fetch jobs');
    });
  });

  describe('getJob', () => {
    it('should fetch a single job by ID', async () => {
      const mockJob = { id: 1, title: 'Senior Developer', salary: '$100K' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockJob,
      });

      const result = await jobsAPI.getJob(1);

      expect(fetch).toHaveBeenCalledWith('/api/jobs/1');
      expect(result).toEqual(mockJob);
    });

    it('should throw error when job not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(jobsAPI.getJob(999)).rejects.toThrow('Failed to fetch job');
    });
  });

  describe('createJob', () => {
    it('should create a new job successfully', async () => {
      const newJob = {
        title: 'New Position',
        description: 'A great opportunity',
        salary: '$80K',
        location: 'New York',
        company_name: 'Tech Corp',
        contact_email: 'hr@techcorp.com',
      };

      const response = { id: 3, ...newJob };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await jobsAPI.createJob(newJob);

      expect(fetch).toHaveBeenCalledWith('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      expect(result).toEqual(response);
    });

    it('should throw error with response data on creation failure', async () => {
      const newJob = { title: 'Invalid Job' };
      const errorData = { errors: [{ msg: 'Title required' }] };

      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorData,
      });

      try {
        await jobsAPI.createJob(newJob);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toBe('Failed to create job');
        expect(error.data).toEqual(errorData);
      }
    });
  });

  describe('updateJob', () => {
    it('should update a job successfully', async () => {
      const jobData = { title: 'Updated Position', salary: '$90K' };
      const response = { id: 1, ...jobData };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await jobsAPI.updateJob(1, jobData);

      expect(fetch).toHaveBeenCalledWith('/api/jobs/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      expect(result).toEqual(response);
    });

    it('should throw error when update fails', async () => {
      const jobData = { title: 'Updated' };
      const errorData = { error: 'Job not found' };

      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorData,
      });

      try {
        await jobsAPI.updateJob(999, jobData);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toBe('Failed to update job');
        expect(error.data).toEqual(errorData);
      }
    });
  });

  describe('deleteJob', () => {
    it('should delete a job successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Job deleted' }),
      });

      const result = await jobsAPI.deleteJob(1);

      expect(fetch).toHaveBeenCalledWith('/api/jobs/1', {
        method: 'DELETE',
      });
      expect(result).toEqual({ message: 'Job deleted' });
    });

    it('should throw error when delete fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(jobsAPI.deleteJob(999)).rejects.toThrow('Failed to delete job');
    });
  });
});
