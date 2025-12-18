import { describe, it, expect } from 'vitest';

// Helper to measure execution time
function measurePerformance(fn, label = 'Operation') {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  console.log(`⏱️  ${label}: ${duration.toFixed(3)}ms`);
  return { result, duration };
}

// Mock job data for performance testing
const generateMockJobs = (count = 1000) => {
  return Array(count).fill(null).map((_, i) => ({
    id: i + 1,
    title: `Job Position ${i + 1}`,
    type: ['Full-Time', 'Part-Time', 'Remote', 'Internship'][Math.floor(Math.random() * 4)],
    salary: `$${Math.floor(Math.random() * 150) + 30}K - $${Math.floor(Math.random() * 150) + 100}K`,
    location: ['San Francisco', 'New York', 'Remote', 'Austin', 'Seattle'][Math.floor(Math.random() * 5)],
    company_name: `Company ${Math.floor(Math.random() * 100)}`,
    description: 'Job description text here...',
    contact_email: `hr${i}@company.com`,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));
};

const mockJobs = generateMockJobs(1000);

describe('📊 API Data Processing Performance', () => {
  it('measures filter performance - by title (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      const query = 'Developer';
      return mockJobs.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase())
      );
    }, 'Filter by title');

    expect(duration).toBeLessThan(50); // Should complete in less than 50ms
  });

  it('measures filter performance - by type (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      return mockJobs.filter(job => job.type === 'Full-Time');
    }, 'Filter by type');

    expect(duration).toBeLessThan(10);
  });

  it('measures sort performance - by date DESC (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      return [...mockJobs].sort((a, b) => b.created_at - a.created_at);
    }, 'Sort by date');

    expect(duration).toBeLessThan(100);
  });

  it('measures sort performance - by title ASC (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      return [...mockJobs].sort((a, b) => a.title.localeCompare(b.title));
    }, 'Sort by title');

    expect(duration).toBeLessThan(100);
  });

  it('measures pagination performance (page 1, 20 per page)', () => {
    const { duration } = measurePerformance(() => {
      const pageSize = 20;
      const page = 1;
      return mockJobs.slice((page - 1) * pageSize, page * pageSize);
    }, 'Paginate');

    expect(duration).toBeLessThan(5);
  });

  it('measures search with multiple filters', () => {
    const { duration } = measurePerformance(() => {
      return mockJobs.filter(job =>
        job.type === 'Full-Time' &&
        job.location === 'San Francisco' &&
        job.title.toLowerCase().includes('developer')
      );
    }, 'Multi-filter search');

    expect(duration).toBeLessThan(50);
  });

  it('measures grouping performance - by type (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      return mockJobs.reduce((acc, job) => {
        if (!acc[job.type]) acc[job.type] = [];
        acc[job.type].push(job);
        return acc;
      }, {});
    }, 'Group by type');

    expect(duration).toBeLessThan(50);
  });

  it('measures find performance - locate single item (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      return mockJobs.find(job => job.id === 500);
    }, 'Find by ID');

    expect(duration).toBeLessThan(5);
  });

  it('measures salary statistics calculation (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      const salaries = mockJobs.map(job => {
        const [min, max] = job.salary.split('-').map(s => parseInt(s.trim()));
        return (min + max) / 2;
      });
      const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
      const sorted = salaries.sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      return { avg, median };
    }, 'Calculate statistics');

    expect(duration).toBeLessThan(100);
  });

  it('measures JSON serialization (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      return JSON.stringify(mockJobs);
    }, 'Serialize to JSON');

    expect(duration).toBeLessThan(100);
  });

  it('measures JSON parsing (1000 items)', () => {
    const jsonStr = JSON.stringify(mockJobs);
    const { duration } = measurePerformance(() => {
      return JSON.parse(jsonStr);
    }, 'Parse JSON');

    expect(duration).toBeLessThan(100);
  });

  it('measures deep clone performance (100 items)', () => {
    const { duration } = measurePerformance(() => {
      return JSON.parse(JSON.stringify(mockJobs.slice(0, 100)));
    }, 'Deep clone');

    expect(duration).toBeLessThan(50);
  });

  it('measures search index creation (1000 items)', () => {
    const { duration } = measurePerformance(() => {
      return mockJobs.reduce((acc, job) => {
        const keywords = [
          job.title.toLowerCase(),
          job.company_name.toLowerCase(),
          job.location.toLowerCase(),
        ];
        keywords.forEach(keyword => {
          if (!acc[keyword]) acc[keyword] = [];
          acc[keyword].push(job.id);
        });
        return acc;
      }, {});
    }, 'Create search index');

    expect(duration).toBeLessThan(100);
  });

  it('benchmarks memory usage pattern', () => {
    const before = process.memoryUsage().heapUsed / 1024 / 1024;
    
    // Create large array
    const largeArray = Array(100000).fill(null).map((_, i) => ({
      id: i,
      data: `Item ${i}`,
    }));

    const after = process.memoryUsage().heapUsed / 1024 / 1024;
    const used = after - before;

    console.log(`💾 Memory used: ${used.toFixed(2)}MB for 100k items`);
    expect(used).toBeLessThan(50); // Should use less than 50MB
  });

  it('throughput test - process 10000 operations', () => {
    const { duration } = measurePerformance(() => {
      let count = 0;
      for (let i = 0; i < 10000; i++) {
        count += i % 2;
      }
      return count;
    }, '10000 operations');

    const throughput = (10000 / (duration / 1000)).toFixed(0);
    console.log(`🚀 Throughput: ${throughput} ops/sec`);

    expect(duration).toBeLessThan(100);
  });
});
