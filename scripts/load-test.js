import autocannon from 'autocannon';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Load test scenarios
const scenarios = {
  read_light: {
    url: 'http://localhost:3000/api/jobs',
    connections: 10,
    duration: 10,
    title: '📊 Light Load Test - GET /api/jobs (10 concurrent)',
    description: 'Baseline performance with light traffic',
  },
  read_medium: {
    url: 'http://localhost:3000/api/jobs',
    connections: 50,
    duration: 10,
    title: '📊 Medium Load Test - GET /api/jobs (50 concurrent)',
    description: 'Normal traffic scenario',
  },
  read_heavy: {
    url: 'http://localhost:3000/api/jobs',
    connections: 100,
    duration: 10,
    title: '📊 Heavy Load Test - GET /api/jobs (100 concurrent)',
    description: 'High traffic scenario',
  },
  read_burst: {
    url: 'http://localhost:3000/api/jobs',
    connections: 200,
    duration: 5,
    title: '📊 Burst Load Test - GET /api/jobs (200 concurrent)',
    description: 'Extreme traffic spike',
  },
  single_job: {
    url: 'http://localhost:3000/api/jobs/1',
    connections: 30,
    duration: 10,
    title: '📄 Single Job Fetch - GET /api/jobs/:id (30 concurrent)',
    description: 'Fetching individual job details',
  },
  create_job: {
    url: 'http://localhost:3000/api/jobs',
    method: 'POST',
    connections: 5,
    duration: 10,
    title: '✏️  Create Job Test - POST /api/jobs (5 concurrent)',
    description: 'Testing job creation endpoint',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'Full-Time',
      title: 'Performance Test Job',
      description: 'A job created during load testing',
      location: 'Test City',
      salary: '$50K - $100K',
      company_name: 'Test Corporation',
      company_description: 'Testing company',
      contact_email: 'perf-test@example.com',
    }),
  },
};

function printHeader(scenario) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${scenario.title}${colors.reset}`);
  console.log(`${colors.cyan}${scenario.description}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

function printResults(result, scenario) {
  const successRate = (result.requests.total / (result.requests.total + result.errors)) * 100;
  const errorRate = 100 - successRate;
  
  console.log(`${colors.bright}📈 Results:${colors.reset}`);
  console.log(`   ${colors.green}✓ Requests/sec: ${result.requests.average.toFixed(2)}${colors.reset}`);
  console.log(`   ${colors.green}✓ Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s${colors.reset}`);
  console.log(`   Latency (mean): ${result.latency.mean.toFixed(2)}ms`);
  console.log(`   Latency (p99): ${result.latency.p99}ms`);
  console.log(`   Latency (min): ${result.latency.min}ms`);
  console.log(`   Latency (max): ${result.latency.max}ms`);
  
  const statusColor = successRate > 95 ? colors.green : successRate > 80 ? colors.yellow : colors.red;
  console.log(`   ${statusColor}Success Rate: ${successRate.toFixed(2)}%${colors.reset}`);
  console.log(`   Total Requests: ${result.requests.total}`);
  console.log(`   Total Errors: ${result.errors}`);
  console.log(`   Total Data (received): ${(result.throughput.total / 1024 / 1024).toFixed(2)} MB\n`);
}

async function runLoadTest(scenario) {
  printHeader(scenario);

  try {
    const result = await autocannon({
      url: scenario.url,
      connections: scenario.connections,
      duration: scenario.duration,
      method: scenario.method || 'GET',
      headers: scenario.headers,
      body: scenario.body,
      requests: scenario.requests,
      pipelining: 10, // Pipeline multiple requests
      timeout: 10,
    });

    printResults(result, scenario);
    
    return {
      name: scenario.title,
      success: true,
      requests: result.requests.total,
      errors: result.errors,
      successRate: (result.requests.total / (result.requests.total + result.errors)) * 100,
      latency: result.latency.mean,
      throughput: result.requests.average,
    };
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}\n`);
    return {
      name: scenario.title,
      success: false,
      error: error.message,
    };
  }
}

async function runAllTests() {
  console.log(`\n${colors.bright}${colors.bright}🚀 Starting API Load Tests...${colors.reset}\n`);
  
  const results = [];
  
  try {
    // Run sequential load tests
    results.push(await runLoadTest(scenarios.read_light));
    results.push(await runLoadTest(scenarios.read_medium));
    results.push(await runLoadTest(scenarios.read_heavy));
    results.push(await runLoadTest(scenarios.single_job));
    results.push(await runLoadTest(scenarios.create_job));
    results.push(await runLoadTest(scenarios.read_burst));

    // Print summary
    console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
    console.log(`${colors.bright}📊 Load Test Summary${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);

    results.forEach(result => {
      if (result.success) {
        const icon = result.successRate > 95 ? '✅' : result.successRate > 80 ? '⚠️ ' : '❌';
        console.log(`${icon} ${result.name}`);
        console.log(`   Throughput: ${result.throughput.toFixed(2)} req/s | Latency: ${result.latency.toFixed(2)}ms | Success: ${result.successRate.toFixed(1)}%\n`);
      } else {
        console.log(`❌ ${result.name}`);
        console.log(`   Error: ${result.error}\n`);
      }
    });

    console.log(`${colors.green}✅ All load tests completed!${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Fatal Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/jobs');
    if (!response.ok) throw new Error('Server not responding correctly');
    console.log(`${colors.green}✓ Server is running and responding${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Server is not running. Please start the server with: npm start${colors.reset}`);
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log(`${colors.bright}${colors.cyan}
╔═══════════════════════════════════════════════════════════════════╗
║       Vue Jobs - API Performance & Load Testing Suite           ║
║                                                                   ║
║  This test simulates various load scenarios on the API           ║
║  to measure throughput, latency, and stability                  ║
╚═══════════════════════════════════════════════════════════════════╝
${colors.reset}`);

  await checkServer();
  await runAllTests();
}

main();
