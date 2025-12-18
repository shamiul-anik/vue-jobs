# How to Implement Performance Tests

This guide provides step-by-step instructions for adding performance tests to your Vue components and services.

## 1. Basic Performance Test Structure

### Test Template

```javascript
import { describe, it, expect } from 'vitest'

describe('MyFeature Performance', () => {
  it('measures operation speed', () => {
    // Measure execution time
    const start = performance.now()
    
    // Operation to measure
    const result = myFunction()
    
    const duration = performance.now() - start
    
    // Assert it completes within acceptable time
    expect(duration).toBeLessThan(100) // Must complete in < 100ms
    expect(result).toBeDefined() // Verify correctness
  })
})
```

---

## 2. Testing API Performance

### Example: Filter Performance Test

```javascript
import { describe, it, expect } from 'vitest'

describe('Job Search Performance', () => {
  // Test data
  const jobs = generateJobs(1000) // 1000 mock jobs
  
  it('filters jobs by title quickly', () => {
    const start = performance.now()
    
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes('developer')
    )
    
    const duration = performance.now() - start
    
    // Should filter 1000 items in under 1ms
    expect(duration).toBeLessThan(1)
    expect(filtered.length).toBeGreaterThan(0)
  })

  it('handles multiple filters efficiently', () => {
    const start = performance.now()
    
    const filtered = jobs.filter(job =>
      job.type === 'Full-Time' &&
      job.location === 'San Francisco' &&
      job.title.includes('Developer')
    )
    
    const duration = performance.now() - start
    
    expect(duration).toBeLessThan(5)
  })

  it('sorts large dataset efficiently', () => {
    const start = performance.now()
    
    const sorted = [...jobs].sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    
    const duration = performance.now() - start
    
    // Sorting 1000 items should complete in < 50ms
    expect(duration).toBeLessThan(50)
  })
})
```

---

## 3. Testing Component Rendering Performance

### Example: Component Render Performance Test

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import JobCard from '../JobCard.vue'

describe('JobCard Component Performance', () => {
  const mockJob = {
    id: 1,
    title: 'Senior Developer',
    type: 'Full-Time',
    salary: '$100K - $150K',
    location: 'San Francisco',
    company_name: 'Tech Corp',
  }

  it('renders single component quickly', () => {
    const start = performance.now()
    
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: { stubs: { 'i': true } },
    })
    
    const duration = performance.now() - start
    
    // Component should render in < 5ms
    expect(duration).toBeLessThan(5)
    expect(wrapper.exists()).toBe(true)
  })

  it('handles multiple components efficiently', () => {
    const start = performance.now()
    
    // Create wrapper with 100 components
    const wrapper = mount({
      template: `
        <div>
          <JobCard v-for="job in jobs" :key="job.id" :job="job" />
        </div>
      `,
      components: { JobCard },
      data: () => ({
        jobs: Array(100).fill(null).map((_, i) => ({
          ...mockJob,
          id: i,
        })),
      }),
      global: { stubs: { 'i': true } },
    })
    
    const duration = performance.now() - start
    
    // 100 components should render in < 100ms
    expect(duration).toBeLessThan(100)
  })

  it('updates props efficiently', () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: { stubs: { 'i': true } },
    })

    const start = performance.now()
    
    // Update props multiple times
    for (let i = 0; i < 10; i++) {
      wrapper.props('job', {
        ...mockJob,
        salary: `$${100 + i}K - $${150 + i}K`,
      })
    }
    
    const duration = performance.now() - start
    
    // 10 prop updates should complete in < 50ms
    expect(duration).toBeLessThan(50)
  })
})
```

---

## 4. Testing Memory Usage

### Example: Memory Performance Test

```javascript
import { describe, it, expect } from 'vitest'

describe('Memory Performance', () => {
  it('efficiently handles large datasets', () => {
    const beforeMemory = process.memoryUsage().heapUsed / 1024 / 1024

    // Create a large dataset
    const largeDataset = Array(100000).fill(null).map((_, i) => ({
      id: i,
      data: `Item ${i}`,
      value: Math.random(),
    }))

    const afterMemory = process.memoryUsage().heapUsed / 1024 / 1024
    const usedMemory = afterMemory - beforeMemory

    // 100k items should use less than 10MB
    expect(usedMemory).toBeLessThan(10)
    
    console.log(`Memory used: ${usedMemory.toFixed(2)}MB`)
  })
})
```

---

## 5. Testing Throughput

### Example: Operations Per Second

```javascript
import { describe, it, expect } from 'vitest'

describe('Throughput Performance', () => {
  it('processes operations at expected throughput', () => {
    const start = performance.now()
    
    // Perform 10000 operations
    let result = 0
    for (let i = 0; i < 10000; i++) {
      result += i % 2
    }
    
    const duration = performance.now() - start
    
    // Calculate operations per second
    const opsPerSecond = (10000 / (duration / 1000)).toFixed(0)
    
    console.log(`Throughput: ${opsPerSecond} ops/sec`)
    
    // Should handle at least 100k ops/sec
    expect(parseInt(opsPerSecond)).toBeGreaterThan(100000)
  })
})
```

---

## 6. Comparing Performance: Before and After

### Performance Regression Detection

```javascript
import { describe, it, expect } from 'vitest'

describe('Performance Regression Detection', () => {
  const BASELINE_PERFORMANCE = {
    filter: 1,     // ms
    sort: 50,      // ms
    render: 5,     // ms
  }

  it('does not regress on filter performance', () => {
    const jobs = generateJobs(1000)
    
    const start = performance.now()
    const filtered = jobs.filter(j => j.type === 'Full-Time')
    const duration = performance.now() - start
    
    expect(duration).toBeLessThan(BASELINE_PERFORMANCE.filter * 1.5)
  })

  it('does not regress on sort performance', () => {
    const jobs = generateJobs(1000)
    
    const start = performance.now()
    const sorted = [...jobs].sort((a, b) => a.id - b.id)
    const duration = performance.now() - start
    
    expect(duration).toBeLessThan(BASELINE_PERFORMANCE.sort * 1.5)
  })
})
```

---

## 7. Real-World Example: Full Test Suite

Create `src/utils/__tests__/search.perf.spec.js`:

```javascript
import { describe, it, expect, beforeAll } from 'vitest'

// Simulated search utility
const SearchUtils = {
  filter: (items, query, fields) => {
    const lowerQuery = query.toLowerCase()
    return items.filter(item =>
      fields.some(field =>
        String(item[field]).toLowerCase().includes(lowerQuery)
      )
    )
  },

  fuzzyMatch: (items, query) => {
    return items.filter(item => {
      const str = item.title.toLowerCase()
      const qry = query.toLowerCase()
      let qIdx = 0
      
      for (let i = 0; i < str.length && qIdx < qry.length; i++) {
        if (str[i] === qry[qIdx]) qIdx++
      }
      
      return qIdx === qry.length
    })
  },

  typeAhead: (items, prefix, limit = 10) => {
    const lower = prefix.toLowerCase()
    return items
      .filter(item => item.title.toLowerCase().startsWith(lower))
      .slice(0, limit)
  },
}

// Generate test data
function generateTestData(count = 1000) {
  const companies = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Meta']
  const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Engineer']
  
  return Array(count).fill(null).map((_, i) => ({
    id: i,
    title: `${roles[i % roles.length]} at ${companies[i % companies.length]}`,
    company: companies[i % companies.length],
    salary: `${50 + i % 50}K`,
  }))
}

describe('Search Utility Performance', () => {
  let items

  beforeAll(() => {
    items = generateTestData(1000)
  })

  describe('Basic Filtering', () => {
    it('performs exact field filtering efficiently', () => {
      const start = performance.now()
      
      const results = SearchUtils.filter(items, 'developer', ['title'])
      
      const duration = performance.now() - start
      
      expect(duration).toBeLessThan(5)
      expect(results.length).toBeGreaterThan(0)
    })

    it('performs multi-field filtering efficiently', () => {
      const start = performance.now()
      
      const results = SearchUtils.filter(
        items,
        'Google',
        ['title', 'company', 'salary']
      )
      
      const duration = performance.now() - start
      
      expect(duration).toBeLessThan(10)
    })
  })

  describe('Advanced Searching', () => {
    it('performs fuzzy matching efficiently', () => {
      const start = performance.now()
      
      const results = SearchUtils.fuzzyMatch(items, 'dvlpr')
      
      const duration = performance.now() - start
      
      expect(duration).toBeLessThan(50)
    })

    it('performs type-ahead efficiently', () => {
      const start = performance.now()
      
      const results = SearchUtils.typeAhead(items, 'dev', 10)
      
      const duration = performance.now() - start
      
      expect(duration).toBeLessThan(5)
    })
  })

  describe('Throughput', () => {
    it('achieves high throughput for filtering', () => {
      const start = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        SearchUtils.filter(items, 'developer', ['title'])
      }
      
      const duration = performance.now() - start
      const throughput = (1000 / (duration / 1000)).toFixed(0)
      
      expect(parseInt(throughput)).toBeGreaterThan(10000)
    })
  })
})
```

---

## 8. Integration with CI/CD

### GitHub Actions Performance Test

Add to `.github/workflows/performance.yml`:

```yaml
name: Performance Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run performance tests
        run: npm run test -- src/**/*.perf.spec.js --run
      
      - name: Run database benchmark
        run: npm run db:benchmark
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: performance-results
          path: performance-*.json
```

---

## Best Practices

✅ **DO:**
- Test with realistic data volumes
- Run tests multiple times for average
- Test both best and worst cases
- Document performance baselines
- Compare before/after optimizations
- Use performance.now() for accurate timing

❌ **DON'T:**
- Test with only tiny datasets
- Mix performance tests with unit tests in same file
- Ignore memory profiling
- Forget to clear caches before tests
- Run performance tests in debug mode
- Assume tests on localhost match production

---

## Resources

- [Vitest Performance Testing](https://vitest.dev/guide/)
- [MDN: Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Node.js Performance Timing](https://nodejs.org/en/docs/guides/simple-profiling/)

---

**Ready to add performance tests to your project? Start with the templates above! 🚀**
