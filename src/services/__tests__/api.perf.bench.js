import { describe, bench } from 'vitest';

// Mock job data for performance testing
const generateMockJobs = (count = 1000) => {
  return Array(count).fill(null).map((_, i) => ({
    id: i + 1,
    title: `Job Position ${i + 1}`,
    type: ['Full-Time', 'Part-Time', 'Remote', 'Internship'][Math.floor(Math.random() * 4)],
    salary: `$${Math.floor(Math.random() * 150) + 30}K - $${Math.floor(Math.random() * 150) + 100}K`,
    location: ['San Francisco', 'New York', 'Remote', 'Austin', 'Seattle'][Math.floor(Math.random() * 5)],
    company_name: `Company ${Math.floor(Math.random() * 100)}`,
    company_description: 'A great company to work for',
    description: 'Job description text here...',
    contact_email: `hr${i}@company.com`,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));
};

const mockJobs = generateMockJobs(1000);

describe('API Data Processing Performance', () => {
  bench('filter jobs by title (1000 items)', () => {
    const query = 'Developer';
    mockJobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase())
    );
  });

  bench('filter jobs by type (1000 items)', () => {
    mockJobs.filter(job => job.type === 'Full-Time');
  });

  bench('filter jobs by location (1000 items)', () => {
    mockJobs.filter(job => job.location === 'Remote');
  });

  bench('sort jobs by creation date DESC (1000 items)', () => {
    [...mockJobs].sort((a, b) => b.created_at - a.created_at);
  });

  bench('sort jobs by title ASC (1000 items)', () => {
    [...mockJobs].sort((a, b) => a.title.localeCompare(b.title));
  });

  bench('paginate jobs - page 1 (20 per page)', () => {
    const pageSize = 20;
    const page = 1;
    mockJobs.slice((page - 1) * pageSize, page * pageSize);
  });

  bench('paginate jobs - page 50 (20 per page)', () => {
    const pageSize = 20;
    const page = 50;
    mockJobs.slice((page - 1) * pageSize, page * pageSize);
  });

  bench('search with single filter (full-time in SF)', () => {
    mockJobs.filter(job =>
      job.type === 'Full-Time' && job.location === 'San Francisco'
    );
  });

  bench('search with multiple filters (5 conditions)', () => {
    mockJobs.filter(job =>
      job.type === 'Full-Time' &&
      job.location === 'San Francisco' &&
      job.title.toLowerCase().includes('developer') &&
      parseInt(job.salary.split('-')[1]) > 100 &&
      job.company_name.includes('Company')
    );
  });

  bench('group jobs by type (1000 items)', () => {
    mockJobs.reduce((acc, job) => {
      if (!acc[job.type]) acc[job.type] = [];
      acc[job.type].push(job);
      return acc;
    }, {});
  });

  bench('group jobs by location (1000 items)', () => {
    mockJobs.reduce((acc, job) => {
      if (!acc[job.location]) acc[job.location] = [];
      acc[job.location].push(job);
      return acc;
    }, {});
  });

  bench('count jobs by type (1000 items)', () => {
    mockJobs.reduce((acc, job) => {
      acc[job.type] = (acc[job.type] || 0) + 1;
      return acc;
    }, {});
  });

  bench('find job by ID (1000 items)', () => {
    mockJobs.find(job => job.id === 500);
  });

  bench('check if job exists in list (1000 items)', () => {
    mockJobs.some(job => job.id === 500);
  });

  bench('extract salary range and parse', () => {
    mockJobs.map(job => {
      const [min, max] = job.salary.split('-').map(s => parseInt(s.trim()));
      return { min, max, avg: (min + max) / 2 };
    });
  });

  bench('create search index (1000 items)', () => {
    mockJobs.reduce((acc, job) => {
      const keywords = [
        job.title.toLowerCase(),
        job.company_name.toLowerCase(),
        job.location.toLowerCase(),
        job.type.toLowerCase(),
      ];
      keywords.forEach(keyword => {
        if (!acc[keyword]) acc[keyword] = [];
        acc[keyword].push(job.id);
      });
      return acc;
    }, {});
  });

  bench('calculate salary statistics (1000 items)', () => {
    const salaries = mockJobs.map(job => {
      const [min, max] = job.salary.split('-').map(s => parseInt(s.trim()));
      return (min + max) / 2;
    });
    const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
    const sorted = salaries.sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    return { avg, median, min: Math.min(...salaries), max: Math.max(...salaries) };
  });

  bench('serialize jobs to JSON (1000 items)', () => {
    JSON.stringify(mockJobs);
  });

  bench('deep clone jobs array (100 items)', () => {
    JSON.parse(JSON.stringify(mockJobs.slice(0, 100)));
  });
});
