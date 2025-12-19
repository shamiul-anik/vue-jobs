# Performance Testing Guide

This guide covers implementing performance tests for the Vue Jobs application across frontend, backend, and database layers.

## Table of Contents

1. [Vitest Benchmarks](#vitest-benchmarks)
2. [API Performance Testing](#api-performance-testing)
3. [Frontend Performance Monitoring](#frontend-performance-monitoring)
4. [Database Query Performance](#database-query-performance)
5. [Bundle Size Analysis](#bundle-size-analysis)

---

## 1. Vitest Benchmarks

### What are Vitest Benchmarks?

Vitest includes built-in benchmark support using `bench()` to measure execution time of critical code paths.

### Setup

No additional installation needed - Vitest already supports benchmarks with `@vitest/bench`.

### Example: Component Rendering Performance

Create `src/components/__tests__/JobCard.perf.bench.js`:

```javascript
import { describe, bench } from 'vitest';
import { mount } from '@vue/test-utils';
import JobCard from '../JobCard.vue';

const mockJob = {
  id: 1,
  title: 'Senior Vue Developer',
  type: 'Full-Time',
  salary: '$100K - $120K',
  location: 'San Francisco, CA',
  company_name: 'Tech Corp',
};

describe('JobCard Performance', () => {
  bench('renders JobCard component', () => {
    mount(JobCard, {
      props: { job: mockJob },
      global: {
        stubs: { 'i': true },
      },
    });
  });

  bench('renders 100 JobCard components', () => {
    const wrapper = mount({
      template: `<div>${Array(100).fill('<JobCard :job="job" />').join('')}</div>`,
      components: { JobCard },
      data: () => ({ job: mockJob }),
    });
  });

  bench('updates JobCard props', () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        stubs: { 'i': true },
      },
    });
    
    wrapper.props('job', {
      ...mockJob,
      title: 'Updated Title',
    });
  });
});
```

### Example: API Service Performance

Create `src/services/__tests__/api.perf.bench.js`:

```javascript
import { describe, bench, vi } from 'vitest';

// Mock response
const mockJobs = Array(1000).fill(null).map((_, i) => ({
  id: i + 1,
  title: `Job ${i + 1}`,
  type: 'Full-Time',
  salary: '$50K - $100K',
  location: 'Remote',
}));

describe('API Service Performance', () => {
  bench('filter jobs by title', () => {
    const query = 'Developer';
    mockJobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase())
    );
  });

  bench('sort jobs by salary', () => {
    [...mockJobs].sort((a, b) => {
      const getMin = (salary) => parseInt(salary.split('-')[0]);
      return getMin(b.salary) - getMin(a.salary);
    });
  });

  bench('paginate jobs (500 items)', () => {
    const pageSize = 20;
    const page = 1;
    mockJobs.slice(
      (page - 1) * pageSize,
      page * pageSize
    );
  });

  bench('search with multiple filters', () => {
    mockJobs.filter(job =>
      job.type === 'Full-Time' &&
      job.location === 'Remote' &&
      job.title.includes('Developer')
    );
  });
});
```

### Running Benchmarks

```bash
# Run all benchmarks
npm run test -- --bench

# Run specific benchmark file
npm run test -- --bench src/components/__tests__/JobCard.perf.bench.js

# Run with GUI (shows results visualization)
npm run test:ui
```

### Benchmark Output Example

```
 ✓ src/components/__tests__/JobCard.perf.bench.js (3 benchmarks) 2345ms

   name                          hz      min      max     mean   p99
   renders JobCard component     45,234  0.021ms  0.089ms 0.022ms 0.034ms
   renders 100 JobCard ...       1,234   0.814ms  2.342ms 0.814ms 1.203ms
   updates JobCard props         32,145  0.031ms  0.157ms 0.032ms 0.089ms
```

---

## 2. API Performance Testing

### Using Autocannon for Load Testing

Autocannon is a HTTP benchmarking tool perfect for testing API endpoints.

### Installation

```bash
npm install --save-dev autocannon
```

### Create Load Testing Script

Create `scripts/load-test.js`:

```javascript
import autocannon from 'autocannon';

// Configuration for different scenarios
const scenarios = {
  lightLoad: {
    url: 'http://localhost:3000/api/jobs',
    connections: 10,
    duration: 10,
    title: 'Light Load Test (10 concurrent connections)',
  },
  mediumLoad: {
    url: 'http://localhost:3000/api/jobs',
    connections: 50,
    duration: 10,
    title: 'Medium Load Test (50 concurrent connections)',
  },
  heavyLoad: {
    url: 'http://localhost:3000/api/jobs',
    connections: 100,
    duration: 10,
    title: 'Heavy Load Test (100 concurrent connections)',
  },
  postTest: {
    url: 'http://localhost:3000/api/jobs',
    method: 'POST',
    connections: 5,
    duration: 10,
    title: 'POST Request Load Test',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'Remote',
      title: 'Test Job',
      description: 'A test job',
      location: 'Test City',
      contact_email: 'test@example.com',
      salary: '$50K - $80K',
      company_name: 'Test Corp',
    }),
  },
};

async function runLoadTest(scenario) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 ${scenario.title}`);
  console.log(`${'='.repeat(60)}\n`);

  const result = await autocannon({
    url: scenario.url,
    connections: scenario.connections,
    duration: scenario.duration,
    method: scenario.method || 'GET',
    headers: scenario.headers,
    body: scenario.body,
    setupClient: (client) => {
      client.on('response', (statusCode) => {
        if (statusCode >= 400) {
          console.error(`❌ Error: ${statusCode}`);
        }
      });
    },
  });

  // Print results
  console.log(`\n📊 Results:`);
  console.log(`   Requests/sec: ${result.requests.average.toFixed(2)}`);
  console.log(`   Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/sec`);
  console.log(`   Latency (ms): ${result.latency.mean.toFixed(2)}`);
  console.log(`   P99 Latency: ${result.latency.p99} ms`);
  console.log(`   Success Rate: ${((result.requests.total / (result.requests.total + result.errors)) * 100).toFixed(2)}%\n`);
}

async function runAllTests() {
  try {
    console.log('\n🏃 Starting API Load Tests...\n');
    
    await runLoadTest(scenarios.lightLoad);
    await runLoadTest(scenarios.mediumLoad);
    await runLoadTest(scenarios.heavyLoad);
    await runLoadTest(scenarios.postTest);
    
    console.log('✅ All load tests completed!\n');
  } catch (error) {
    console.error('❌ Load test failed:', error.message);
    process.exit(1);
  }
}

runAllTests();
```

### Add npm Script

Update `package.json`:

```json
"scripts": {
  ...
  "load-test": "node scripts/load-test.js",
  "load-test:light": "autocannon -c 10 -d 10 http://localhost:3000/api/jobs",
  "load-test:medium": "autocannon -c 50 -d 10 http://localhost:3000/api/jobs",
  "load-test:heavy": "autocannon -c 100 -d 10 http://localhost:3000/api/jobs"
}
```

### Usage

```bash
# Run comprehensive load tests
npm run load-test

# Or run individual tests
npm run load-test:light
npm run load-test:medium
npm run load-test:heavy
```

---

## 3. Frontend Performance Monitoring

### Using Web Vitals

Install performance monitoring library:

```bash
npm install web-vitals
```

### Create Performance Monitor Service

Create `src/services/performanceMonitor.js`:

```javascript
import {
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
} from 'web-vitals';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      cls: null,  // Cumulative Layout Shift
      fid: null,  // First Input Delay
      fcp: null,  // First Contentful Paint
      lcp: null,  // Largest Contentful Paint
      ttfb: null, // Time to First Byte
    };
    this.logs = [];
  }

  init() {
    // Measure Core Web Vitals
    getCLS((metric) => this.recordMetric('cls', metric));
    getFID((metric) => this.recordMetric('fid', metric));
    getFCP((metric) => this.recordMetric('fcp', metric));
    getLCP((metric) => this.recordMetric('lcp', metric));
    getTTFB((metric) => this.recordMetric('ttfb', metric));

    // Measure Navigation Timing
    window.addEventListener('load', () => {
      this.measureNavigationTiming();
    });

    // Measure Component Rendering
    this.measureComponentPerformance();
  }

  recordMetric(name, metric) {
    this.metrics[name] = {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    };
    
    console.log(`${name.toUpperCase()}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
    this.logs.push({
      timestamp: new Date().toISOString(),
      metric: name,
      value: metric.value,
      rating: metric.rating,
    });
  }

  measureNavigationTiming() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;

    console.log(`
    📊 Page Load Metrics:
      Total Load Time: ${pageLoadTime}ms
      DOM Ready Time: ${domReadyTime}ms
      Connect Time: ${connectTime}ms
    `);

    this.logs.push({
      timestamp: new Date().toISOString(),
      metric: 'page_load_time',
      value: pageLoadTime,
    });
  }

  measureComponentPerformance() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        this.logs.push({
          timestamp: new Date().toISOString(),
          metric: 'component_render',
          component: entry.name,
          duration: entry.duration,
        });
      }
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  getMetrics() {
    return this.metrics;
  }

  getLogs() {
    return this.logs;
  }

  exportMetrics() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

### Integrate into Vue App

Update `src/main.js`:

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { performanceMonitor } from './services/performanceMonitor'

const app = createApp(App)

// Initialize performance monitoring in production
if (import.meta.env.PROD) {
  performanceMonitor.init()
}

app.use(router).mount('#app')
```

### Create Performance Dashboard

Create `src/views/PerformanceDashboard.vue`:

```vue
<template>
  <div class="p-8 bg-gray-50">
    <h1 class="text-3xl font-bold mb-6">⚡ Performance Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div v-for="(metric, key) in metrics" :key="key" class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-semibold text-gray-600 uppercase">{{ formatMetricName(key) }}</h3>
        <p v-if="metric" class="text-2xl font-bold text-blue-600">{{ metric.value.toFixed(2) }}ms</p>
        <p v-else class="text-gray-400">Loading...</p>
        <p v-if="metric" :class="`text-sm font-medium ${getRatingClass(metric.rating)}`">
          {{ metric.rating }}
        </p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">📋 Performance Logs</h2>
      <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">{{ JSON.stringify(logs, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { performanceMonitor } from '../services/performanceMonitor'

const metrics = ref({})
const logs = ref([])

onMounted(() => {
  metrics.value = performanceMonitor.getMetrics()
  logs.value = performanceMonitor.getLogs()
})

const formatMetricName = (key) => {
  const names = {
    cls: 'CLS',
    fid: 'FID',
    fcp: 'FCP',
    lcp: 'LCP',
    ttfb: 'TTFB',
  }
  return names[key] || key
}

const getRatingClass = (rating) => {
  if (rating === 'good') return 'text-green-600'
  if (rating === 'needs-improvement') return 'text-yellow-600'
  if (rating === 'poor') return 'text-red-600'
  return ''
}
</script>
```

---

## 4. Database Query Performance

### Create Query Performance Tests

Create `db/__tests__/query.perf.bench.js`:

```javascript
import { describe, bench, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('db/test.db');
let db;

beforeAll(() => {
  db = new Database(dbPath, { verbose: console.log });
  
  // Create test table
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT,
      location TEXT,
      salary TEXT,
      company_name TEXT,
      description TEXT,
      contact_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_title ON jobs(title);
    CREATE INDEX IF NOT EXISTS idx_type ON jobs(type);
    CREATE INDEX IF NOT EXISTS idx_location ON jobs(location);
  `);

  // Insert test data
  const insert = db.prepare(`
    INSERT INTO jobs (title, type, location, salary, company_name, description, contact_email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < 1000; i++) {
    insert.run(
      `Job Title ${i}`,
      ['Full-Time', 'Part-Time', 'Remote'][Math.floor(Math.random() * 3)],
      ['San Francisco', 'New York', 'Remote'][Math.floor(Math.random() * 3)],
      '$50K - $100K',
      `Company ${Math.floor(Math.random() * 10)}`,
      'Job description',
      `test${i}@example.com`
    );
  }
});

afterAll(() => {
  db.exec('DROP TABLE IF EXISTS jobs');
  db.close();
});

describe('Database Query Performance', () => {
  bench('select all jobs', () => {
    db.prepare('SELECT * FROM jobs').all();
  });

  bench('select with WHERE clause', () => {
    db.prepare('SELECT * FROM jobs WHERE type = ?').all('Full-Time');
  });

  bench('select with LIKE', () => {
    db.prepare('SELECT * FROM jobs WHERE title LIKE ?').all('%Developer%');
  });

  bench('select with multiple filters', () => {
    db.prepare(
      'SELECT * FROM jobs WHERE type = ? AND location = ? AND salary LIKE ?'
    ).all('Full-Time', 'San Francisco', '%100%');
  });

  bench('count jobs', () => {
    db.prepare('SELECT COUNT(*) FROM jobs').get();
  });

  bench('insert single job', () => {
    db.prepare(`
      INSERT INTO jobs (title, type, location, salary, company_name, description, contact_email)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('New Job', 'Full-Time', 'Remote', '$80K', 'Tech Corp', 'Desc', 'test@example.com');
  });

  bench('update job', () => {
    db.prepare('UPDATE jobs SET salary = ? WHERE id = ?').run('$120K', 1);
  });

  bench('delete job', () => {
    db.prepare('DELETE FROM jobs WHERE id = ?').run(999);
  });

  bench('select with pagination (limit 20)', () => {
    db.prepare('SELECT * FROM jobs LIMIT 20 OFFSET 0').all();
  });

  bench('select with ORDER BY', () => {
    db.prepare('SELECT * FROM jobs ORDER BY created_at DESC LIMIT 50').all();
  });
});
```

### Installation for DB Testing

```bash
npm install --save-dev better-sqlite3
```

---

## 5. Bundle Size Analysis

### Using vite-plugin-visualizer

```bash
npm install --save-dev vite-plugin-visualizer
```

### Update `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

### Add npm Scripts

```json
{
  "scripts": {
    "build:analyze": "vite build && npm run analyze",
    "analyze": "node -e \"require('rollup-plugin-visualizer/dist/plugin.js')\""
  }
}
```

### Usage

```bash
npm run build:analyze
```

---

## Complete Performance Test Suite

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:perf": "vitest --bench",
    "test:perf:watch": "vitest --bench --watch",
    "load-test": "node scripts/load-test.js",
    "build:analyze": "vite build"
  }
}
```

---

## Performance Testing Checklist

### Before Each Release

- [ ] Run unit/component benchmarks: `npm run test:perf`
- [ ] Run load tests: `npm run load-test`
- [ ] Analyze bundle size: `npm run build:analyze`
- [ ] Monitor Core Web Vitals in production
- [ ] Check database query performance: `npm run db:benchmark`
- [ ] Review performance logs from dashboard

### Performance Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5-4s | > 4s |
| FID (First Input Delay) | < 100ms | 100-300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |
| API Response | < 100ms | 100-300ms | > 300ms |
| Page Load | < 3s | 3-5s | > 5s |
| Bundle Size | < 200KB | 200-300KB | > 300KB |

---

## Tips & Best Practices

1. **Baseline Establishment**: Run benchmarks on your target machine before optimization
2. **Isolated Environment**: Run performance tests in isolation without other processes
3. **Multiple Runs**: Run benchmarks multiple times to get average values
4. **Profile Regularly**: Monitor performance continuously, not just before releases
5. **Cache Busting**: Always clear caches before performance measurements
6. **Network Simulation**: Test with throttled network to simulate real-world conditions
7. **Database Optimization**: Use indexes and query optimization for faster queries
8. **Code Splitting**: Split Vue components for lazy loading
9. **Image Optimization**: Compress images and use WebP format
10. **Minification**: Ensure CSS and JS are minified in production

---

**Happy Performance Testing! 🚀**
