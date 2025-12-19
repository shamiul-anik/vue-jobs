# Performance Testing Quick Start

This guide covers how to implement and run performance tests for the Vue Jobs application.

## 📊 Available Performance Tests

### 1. API Data Processing Performance Tests ✅ (Ready to Use)

Tests that measure throughput, latency, and efficiency of data operations on 1000+ items.

```bash
npm run test -- src/services/__tests__/api.perf.spec.js --run
```

**Measures:**
- Filtering by title, type, and location
- Sorting operations (by date, by title)
- Pagination performance
- Complex multi-filter searches
- Data grouping and statistics
- JSON serialization/parsing
- Memory usage patterns
- Throughput (operations per second)

**Results from recent run:**
```
✓ Filter by title: 0.424ms
✓ Filter by type: 0.146ms
✓ Sort by date: 2.943ms
✓ Sort by title: 19.172ms
✓ Pagination: 0.030ms
✓ Multi-filter search: 0.156ms
✓ JSON serialization: 3.899ms
✓ Throughput: 26M+ ops/sec
✓ Memory: 1.55MB for 100k items
```

---

## 🚀 API Load Testing (Coming Soon)

### Manual Load Test Commands

Before running load tests, ensure the server is running:

```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Run load tests
npm run load-test
```

### Load Test Scenarios Included

```bash
# Light load (10 concurrent connections)
npm run load-test:light

# Medium load (50 concurrent connections)
npm run load-test:medium

# Heavy load (100 concurrent connections)
npm run load-test:heavy
```

### Expected Results
- Throughput: 3,000-4,000 requests/second
- Latency: 20-50ms average
- Success rate: >95%

---

## 🧪 Component Performance Tests

```bash
npm run test -- src/components/__tests__/JobCard.perf.spec.js --run
```

Measures:
- Single component render time
- Rendering multiple components (10, 50 items)
- Props update performance
- DOM mounting speed

---

## 📈 Database Query Performance

```bash
npm run db:benchmark
```

Tests raw SQLite performance with:
- 10,000 insert operations
- 1,000 random reads
- Query optimization impact

---

## 🎯 Comprehensive Performance Suite

Run all performance tests:

```bash
# Unit + API perf tests
npm run test:perf

# With watch mode (re-run on file changes)
npm run test:perf:watch

# All perf tests + load tests + database benchmark
npm run perf:all
```

---

## 📊 Understanding Performance Metrics

### Key Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Filter Operations** | <1ms | 1-5ms | >5ms |
| **Sort Operations** | <20ms | 20-50ms | >50ms |
| **Pagination** | <1ms | 1-5ms | >5ms |
| **JSON Serialization** | <5ms | 5-10ms | >10ms |
| **Memory per 100k items** | <2MB | 2-5MB | >5MB |
| **Throughput** | >1M ops/sec | 100K-1M ops/sec | <100K ops/sec |
| **API Response (GET)** | <100ms | 100-300ms | >300ms |
| **Component Render** | <5ms | 5-20ms | >20ms |

### Interpreting Results

```
✓ Green (Good): Performance within acceptable range
⚠️  Yellow (Warning): Performance degrading, investigate optimization
❌ Red (Critical): Performance critically slow, immediate optimization needed
```

---

## 🔧 Optimization Tips Based on Performance Results

### If Filtering is Slow
- Add database indexes on frequently filtered fields
- Consider search indexes for full-text search
- Use memoization for repeated filters

### If Sorting is Slow
- Add database indexes on sort fields
- Implement pagination to sort smaller datasets
- Use pre-computed sort orders for common cases

### If Memory Usage is High
- Implement lazy loading
- Use virtual scrolling for large lists
- Stream data instead of loading all at once

### If JSON Operations are Slow
- Use streaming JSON parsers for large datasets
- Compress JSON before transmission
- Consider binary formats (MessagePack, Protocol Buffers)

### If API Response is Slow
- Enable response caching
- Add database query optimization
- Implement pagination
- Use compression (gzip/brotli)

---

## 📋 Performance Testing Workflow

1. **Baseline**: Run tests before making changes
   ```bash
   npm run test -- src/services/__tests__/api.perf.spec.js --run > baseline.txt
   ```

2. **Modify**: Make performance optimizations

3. **Compare**: Run tests again
   ```bash
   npm run test -- src/services/__tests__/api.perf.spec.js --run > after.txt
   ```

4. **Verify**: Check improvements
   ```bash
   # Compare the two files
   diff baseline.txt after.txt
   ```

---

## 🎨 Component Performance Testing Example

For Vue components, test rendering performance:

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('Component Performance', () => {
  it('renders quickly', () => {
    const start = performance.now()
    const wrapper = mount(MyComponent)
    const duration = performance.now() - start
    
    // Should render in less than 5ms
    expect(duration).toBeLessThan(5)
    expect(wrapper.exists()).toBe(true)
  })

  it('handles large datasets efficiently', () => {
    const start = performance.now()
    const items = Array(1000).fill(null).map((_, i) => ({ id: i }))
    const wrapper = mount(MyComponent, {
      props: { items }
    })
    const duration = performance.now() - start
    
    // Rendering 1000 items should complete in reasonable time
    expect(duration).toBeLessThan(100)
  })
})
```

---

## 📈 Continuous Monitoring

### GitHub Actions Example

Add to `.github/workflows/performance.yml`:

```yaml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '22'
      
      - run: npm ci
      - run: npm run test -- src/services/__tests__/api.perf.spec.js --run
      - run: npm run db:benchmark
```

---

## ✅ Performance Checklist

Before each release:

- [ ] Run all performance tests: `npm run test -- src/services/__tests__/api.perf.spec.js --run`
- [ ] Run database benchmark: `npm run db:benchmark`
- [ ] Check component rendering speed
- [ ] Verify no performance regressions vs. baseline
- [ ] Monitor Core Web Vitals in production
- [ ] Review bundle size: `npm run build`
- [ ] Test with realistic data volumes
- [ ] Verify database query optimization

---

## 🔗 Related Documentation

- [Full Performance Testing Guide](./PERFORMANCE_TESTING_GUIDE.md)
- [Database Benchmarking](./scripts/benchmark-db.js)
- [Load Testing Script](./scripts/load-test.js)

---

**Happy Performance Testing! 🚀**
