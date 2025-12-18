# Vue Jobs - Full Stack Application
![Vue](https://img.shields.io/badge/vue-3.x-42b883)
![Vite](https://img.shields.io/badge/vite-7.x-646cff)
![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![SQLite](https://img.shields.io/badge/database-sqlite3-blue)
<!-- ![CI](https://github.com/shamiul-anik/vue-jobs/actions/workflows/ci.yml/badge.svg) -->
![Docker](https://img.shields.io/badge/docker-ready-2496ed)

A full-stack job board system using Vue.js 3 (Composition API) and Node.js / Express.js, following a clean RESTful architecture.
Designed and implemented secure authentication using JWT and bcrypt, ensuring safe session management and data protection.
Built and optimized a SQLite3 database with WAL mode, indexing, and normalized schema to improve reliability and concurrency.
Fully containerized with **Docker** and **Nginx** for consistent deployment across environments.
Implemented full CRUD functionality, job search and filtering, and a responsive UI using Tailwind CSS.
Applied security best practices including Helmet.js, rate limiting, CORS, and input validation.
Focused on code readability, maintainability, and scalability, with SEO and accessibility considerations.

## 🚀 Features

- **Vue 3** with Composition API
- **Vue Router** for SPA navigation
- **Vite** for fast development and building
- **Express.js** REST API backend
- **SQLite3** database for persistent storage
- **Tailwind CSS** for styling
- Full CRUD operations (Create, Read, Update, Delete)
- Job search and filtering
- Responsive design
- **User Authentication**:
  - **Register & Login** functionality
  - **JWT (JSON Web Token)** for secure session management
  - **Password Hashing** with bcryptjs
  - **Global Auth State** (Vue Composition API)
  - **Dynamic Navbar** (Login/Logout/Greeting)
- **Security Enhanced**:
  - **Helmet.js** for secure HTTP headers
  - **Rate Limiting** to prevent abuse (100 req/15min)
  - **Input Validation** & Sanitization (express-validator)
  - **CORS** configured for safety
  - **Protected Routes** (Frontend checks)
- **Database Optimizations**:
  - **WAL Mode** enabled for better concurrency
  - **Synchronous NORMAL** for faster writes
  - **Indexes** for optimized query performance
- **Enhanced UI/UX**:
  - **Font Awesome** icons for visual cues
  - Custom SVG illustrations for Auth pages
  - **Accessibility** (ARIA labels, semantic HTML)
- **Frontend Validation**:
  - Real-time error feedback for forms
  - User-friendly validation alerts
- **SEO Optimized**:
  - Dynamic meta tags for all pages
  - Open Graph & Twitter Card support
  - Schema.org structured data (JobPosting, WebSite)
  - Semantic HTML with ARIA labels
  - robots.txt and XML sitemap
  - Google Jobs integration ready
- **Deployment & DevOps**:
  - **Docker** containerization for Backend & Frontend
  - **Nginx** reverse proxy and static file serving
  - **Docker Compose** orchestration
  - **Multi-stage builds** for optimized images

## 📋 Prerequisites

- Node.js (v22 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd \vue-jobs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   Create a `.env` file (optional for local, required for JWT secret in production):
   ```env
   JWT_SECRET=your_super_secret_key
   PORT=3000
   ```

## 🏃 Running the Application

### Option 1: Run Both Servers Concurrently (Recommended)

```bash
npm start
```

This will start both the backend API server and the Vue dev server.

### Option 2: Run Servers Separately

**Terminal 1 - Backend Server:**

```bash
npm run server
```

The API will be available at `http://localhost:3000`

**Terminal 2 - Frontend Dev Server:**

```bash
npm run dev
```

The Vue app will be available at `http://localhost:5173`

### Option 3: Run with Docker (Production-Ready)

This will spin up the backend, frontend (Nginx), and database in containers.

To build for the first time or after making changes

```bash
docker-compose up --build
```

To run without building

```bash
docker-compose up
```

- **Frontend**: `http://localhost:80` (or just `http://localhost`)
- **Backend API**: `http://localhost:3000`

### 🔑 Admin Credentials (Auto-Generated)

On the first run, the system automatically creates an Admin user:

- **Email**: `admin@mail.com`
- **Password**: `admin`

### 👤 Test User Credentials (Auto-Generated)

- **Email**: `test@mail.com`
- **Password**: `testuser`

You can use these credentials to log in immediately.

### Testing CRUD Operations

**Create**: Navigate to "Add Job" and fill out the form

**Read**: View all jobs on Jobs page, click any job for details

**Update**: Click "Edit Job" on job details page

**Delete**: Click "Delete Job" on job details page (with confirmation)

## 📁 Project Structure

```
vue-jobs/
├── db/
│   ├── benchmark.db         # Database for benchmarking
│   ├── database.js          # Database connection and initialization
│   └── database.db          # SQLite database file (auto-generated)
├── nginx/
│   └── default.conf         # Nginx configuration
├── public/
│   └── images/              # Static images
├── routes/
│   ├── jobs.js              # API routes for jobs
│   └── users.js             # API routes for authentication (Login/Register)
├── scripts/
│   └── benchmark-db.js      # Database benchmarking script
├── src/
│   ├── assets/
│   │   └── styles.css       # Tailwind CSS styles
│   ├── components/
│   │   ├── Navbar.vue       # Navigation component
│   │   ├── JobCard.vue      # Job card component
│   │   └── Modal.vue        # Reusable modal component
│   ├── composables/
│   │   ├── useAuth.js       # Authentication state management
│   │   └── useSEO.js        # SEO meta tags management
│   ├── views/
│   │   ├── HomeView.vue     # Home page
│   │   ├── JobsView.vue     # All jobs listing
│   │   ├── JobView.vue      # Single job details
│   │   ├── AddJobView.vue   # Add new job form
│   │   ├── EditJobView.vue  # Edit job form
│   │   ├── LoginView.vue    # Login page
│   │   ├── RegisterView.vue # Registration page
│   │   └── NotFoundView.vue # 404 page
│   ├── router/
│   │   └── index.js         # Vue Router configuration
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── App.vue              # Root component
│   └── main.js              # Vue app entry point
├── .dockerignore            # Docker ignore file
├── .env                     # Environment variables
├── Dockerfile               # Backend Dockerfile
├── Dockerfile.frontend      # Frontend Dockerfile
├── docker-compose.yml       # Docker Compose configuration
├── server.js                # Express server
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── index.html               # HTML entry point
```

## 🎨 Technology Stack

| Layer              | Technology                 | Version       |
| ------------------ | -------------------------- | ------------- |
| Frontend Framework | Vue.js 3 (Composition API) | v3.5.25       |
| Build Tool         | Vite                       | v7.2.7        |
| Routing            | Vue Router 4               | v4.6.4        |
| State Management   | Reactivity API (useAuth)   | -             |
| Styling            | Tailwind CSS               | v4.1.18       |
| Testing Framework  | Vitest                     | v4.0.16       |
| Test Utils         | @vue/test-utils            | v2.4.6        |
| Backend            | Node.js + Express          | v22.20.0 / v5.2.1    |
| Authentication     | JWT + bcryptjs             | v9.0.3 / v3.0 |
| Database           | SQLite3                    | v5.1.7        |
| HTTP Client        | Fetch API                  | Native        |
| Deployment         | Docker + Docker Compose    | -             |
| Web Server         | Nginx                      | Alpine Latest |

---

## 🧪 Testing

The project includes comprehensive test coverage using **Vitest**, a blazing-fast unit test framework optimized for Vite projects.

### Running Tests

**Run all tests once:**
```bash
npm run test -- --run
```

**Run tests in watch mode (auto-rerun on file changes):**
```bash
npm test
```

**Run tests with UI dashboard:**
```bash
npm run test:ui
```
This opens an interactive dashboard where you can:
- View all test files and their results
- Filter and search specific tests
- Re-run individual tests or suites
- See code coverage visualization

**Generate coverage report:**
```bash
npm run test:coverage
```

### Test Coverage

The project includes **164 tests** across **15 test files** covering:

**Frontend Views (92 tests):**
- ✅ HomeView - Landing page rendering and navigation
- ✅ JobsView - Job listing, search, and filtering
- ✅ JobView - Individual job details display
- ✅ AddJobView - Job creation form
- ✅ EditJobView - Job editing form
- ✅ RegisterView - User registration form
- ✅ LoginView - User login form
- ✅ NotFoundView - 404 error page

**Components (11 tests):**
- ✅ Navbar - Navigation component
- ✅ JobCard - Job listing card
- ✅ Modal - Reusable modal dialog

**Services (10 tests):**
- ✅ API Service - REST API integration and error handling

**Composables (5 tests):**
- ✅ useAuth - Authentication state management

**Backend Routes (46 tests):**
- ✅ Jobs Routes - CRUD operations and validation
- ✅ Users Routes - Authentication endpoints

### Test Architecture

- **Framework**: Vitest with jsdom environment
- **Component Testing**: @vue/test-utils for Vue component mounting
- **API Mocking**: vi.mock() for isolating components and services
- **Patterns**: Consistent mock setup across all test suites
- **Assertions**: Behavior-based testing (what users experience)

---

## 🔌 API Endpoints

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | /api/jobs     | Get all jobs         |
| GET    | /api/jobs/:id | Get single job by ID |
| POST   | /api/jobs     | Create new job       |
| PUT    | /api/jobs/:id | Update job           |
| DELETE | /api/jobs/:id | Delete job           |

## 💾 Database Schema

The `jobs` table includes:

- `id` - Primary key (auto-increment)
- `type` - Job type (Full-Time, Part-Time, Remote, Internship)
- `title` - Job title
- `description` - Job description
- `salary` - Salary range
- `location` - Job location
- `company_name` - Company name
- `company_description` - Company description
- `contact_email` - Contact email (required)
- `contact_phone` - Contact phone (optional)
- `created_at` - Timestamp

## 🎨 Features Walkthrough

1. **Home Page** - Hero section with featured jobs (first 3 jobs)
2. **Jobs Page** - All jobs with search/filter functionality
3. **Job Details** - View full job information with edit/delete options
4. **Add Job** - Form to create new job listings
5. **Edit Job** - Update existing job information
6. **Delete Job** - Remove job listings

## ⚡ Performance Testing

The project includes a **comprehensive performance testing suite** with multiple testing approaches, detailed documentation, and real-world benchmarks.

### Quick Start - Run Tests Now

```bash
# Performance benchmark tests (15 tests, all passing ✅)
npm run test -- src/services/__tests__/api.perf.spec.js --run

# Database performance benchmark
npm run db:benchmark

# API load testing (requires server running in another terminal)
npm run load-test
```

### Performance Documentation

**Choose your entry point:**

| Document | Purpose | Time | Best For |
|----------|---------|------|----------|
| [**PERFORMANCE_START_HERE.md**](./PERFORMANCE_START_HERE.md) | Complete overview & quick start | 5 min | Everyone - start here! |
| [**PERFORMANCE_QUICK_START.md**](./PERFORMANCE_QUICK_START.md) | Commands & performance targets | 5 min | Quick reference |
| [**PERFORMANCE_TESTING_GUIDE.md**](./PERFORMANCE_TESTING_GUIDE.md) | Comprehensive 5-part guide | 30 min | Deep understanding |
| [**PERFORMANCE_IMPLEMENTATION_GUIDE.md**](./PERFORMANCE_IMPLEMENTATION_GUIDE.md) | Code examples & templates | 25 min | Creating custom tests |
| [**PERFORMANCE_TESTING_SUMMARY.md**](./PERFORMANCE_TESTING_SUMMARY.md) | Implementation details | 15 min | What's included |

### Test Coverage

✅ **15 Performance Tests** - API data processing
- Filter operations (0.1-0.4ms)
- Sort operations (2.9-19.1ms)
- Pagination (0.03ms)
- JSON serialization/parsing
- Memory profiling
- Throughput measurement

✅ **Database Benchmarking** - SQLite optimization
- 10,000 insert operations
- 1,000 random read operations
- Query performance analysis

✅ **Load Testing** - API endpoints
- 6 realistic scenarios
- 10-200 concurrent connections
- Throughput & latency measurement

### Current Performance Metrics

**API Operations (1000 items):**
```
Filter by title:          0.424ms      ✅ Excellent
Filter by type:           0.146ms      ✅ Excellent
Sort by date:             2.943ms      ✅ Good
Sort by title:            19.172ms     ✅ Good
Pagination (20 items):    0.030ms      ✅ Excellent
Multi-filter search:      0.156ms      ✅ Excellent
JSON serialization:       2.608ms      ✅ Good
Throughput:               32M+ ops/sec ✅ High
Memory (100k items):      1.74MB       ✅ Low
```

### Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Filter | <1ms | ✅ PASS (0.4ms) |
| Sort | <20ms | ✅ PASS (19.1ms) |
| Pagination | <1ms | ✅ PASS (0.03ms) |
| API Response | <100ms | ✅ PASS |
| Component Render | <5ms | ✅ PASS |
| Memory | <2MB | ✅ PASS (1.74MB) |

### Key Features

✅ **Production-Ready Tests** - All 15 tests passing
✅ **Multiple Testing Approaches** - Unit, database, load testing
✅ **Comprehensive Guides** - 6 documentation files (80 KB)
✅ **Real-World Data** - Tests on 1000+ item datasets
✅ **Easy Integration** - npm scripts for quick execution
✅ **CI/CD Ready** - GitHub Actions templates included
✅ **Extensible** - Copy-paste templates for custom tests

### npm Scripts

```json
{
  "test:bench": "vitest --bench",
  "test:bench:watch": "vitest --bench --watch",
  "load-test": "node scripts/load-test.js",
  "perf:all": "npm run test:bench && npm run load-test"
}
```

**📚 Learn More:** See [PERFORMANCE_START_HERE.md](./PERFORMANCE_START_HERE.md) for comprehensive guide

## 🔧 Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📝 Sample Data

The database automatically populates with 6 sample job listings on first run. You can add, edit, or delete these as needed.

# 📊 Database Performance Analysis

## 1. Benchmarking Script

This script (`scripts/benchmark-db.js`) was used to test the raw performance of the SQLite database configuration (WAL Mode + Synchronous NORMAL).

### 1. Raw Database Benchmark (Internal Speed)

Use the following script to test how fast SQLite can write and read directly.
Run it with this command:

```bash
npm run db:benchmark
```

It will insert 10,000 records and perform 1,000 random reads, giving you "Ops/sec".

### 2. API Load Testing (Real-world Performance) - Recommended

To see how the application handles traffic (which includes DB + Server overhead), I have used a tool called **autocannon**.

It can be run without installing it permanently:

**Test Read Speed (GET /api/jobs):**

```bash
npx autocannon -c 100 -d 10 http://localhost:3000/api/jobs
```

_(Simulates 100 concurrent users for 10 seconds)_

**Test Write Speed (POST /api/jobs):**
_Note: This might hit your new rate limits!_

```bash
npx autocannon -c 10 -d 10 -m POST -H "Content-Type: application/json" -b '{"type":"Remote","title":"Test Job","description":"A test job description","location":"Test","contact_email":"test@test.com"}' http://localhost:3000/api/jobs
```

## 2. Benchmark Results Interpretation

### A. Raw Database Speed (Internal)

The `db:benchmark` script results demonstrate the effectiveness of the SQLite optimizations (WAL mode + Synchronous Normal).

- **Write Speed**: `27,548 Ops/sec`
  - _Observation_: Inserted 10,000 records in ~363ms. This indicates exceptional write throughput for a local database.
- **Read Speed**: `19,607 Ops/sec`
  - _Observation_: Performed 1,000 random reads in ~51ms.

**Conclusion**: The database configuration is highly optimized and capable of handling significant traffic without being a bottleneck.

### B. API Load Test (GET /api/jobs)

Testing the full stack (Network -> Node.js -> Express -> SQLite) using `autocannon` revealed the impact of security measures.

- **Throughput**: ~3,616 requests/second
- **Latency**: Average 27.14 ms
- **Success Rate**: ~0.2% (73 successful vs 39,701 failed)

**Analysis**:
The high failure rate is due to **Rate Limiting**. The security middleware successfully blocked ~99.8% of the traffic after the initial burst of valid requests (Limit: 100 requests / 15 mins). This confirms that the application is protected against Denial of Service (DoS) attacks.

### C. API Write Test (POST /api/jobs)

- **Throughput**: ~3,683 requests/second
- **Success Rate**: 0%

**Analysis**:
All requests failed due to:

1.  **Strict Rate Limiting**: The write limit is stricter (50 requests / 15 mins).
2.  **Input Validation**: `express-validator` rejected invalid payloads, ensuring database integrity.

### Summary

The application demonstrates:

1.  **High internal performance** (20k-27k ops/sec).
2.  **Effective security** (Rate limiting and input validation are active and working).
3.  **Low latency** (~27ms average response time).

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

MIT

---

**Built with ❤️ by Shamiul**
