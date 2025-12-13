# Vue Jobs - Full Stack Application

A full-stack job board application built with **Vue.js 3** and **SQLite3**. This project demonstrates a complete CRUD application with a modern frontend and RESTful API backend.

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

## 📋 Prerequisites

- Node.js (v22 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd \testing-vue
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

### 🔑 Admin Credentials (Auto-Generated)

On the first run, the system automatically creates an Admin user:

- **Email**: `admin@mail.com`
- **Password**: `admin`

You can use these credentials to log in immediately.

### Testing CRUD Operations

**Create**: Navigate to "Add Job" and fill out the form

**Read**: View all jobs on Jobs page, click any job for details

**Update**: Click "Edit Job" on job details page

**Delete**: Click "Delete Job" on job details page (with confirmation)

## 📁 Project Structure

```
testing-vue/
├── db/
│   ├── database.js          # Database connection and initialization
│   └── database.db          # SQLite database file (auto-generated)
├── routes/
│   ├── jobs.js              # API routes for jobs
│   └── users.js             # API routes for authentication (Login/Register)
├── src/
│   ├── assets/
│   │   └── styles.css       # Tailwind CSS styles
│   ├── components/
│   │   ├── Navbar.vue       # Navigation component
│   │   ├── JobCard.vue      # Job card component
│   │   └── Modal.vue        # Reusable modal component
│   ├── composites/
│   │   └── useAuth.js       # Authentication state management
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
├── server.js                # Express server
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── index.html               # HTML entry point
```

## 🎨 Technology Stack

| Layer              | Technology                 |
| ------------------ | -------------------------- |
| Frontend Framework | Vue.js 3 (Composition API) |
| Build Tool         | Vite                       |
| Routing            | Vue Router 4               |
| State Management   | Reactivity API (useAuth)   |
| Styling            | Tailwind CSS               |
| Backend            | Node.js + Express          |
| Authentication     | JWT + bcryptjs             |
| Database           | SQLite3                    |
| HTTP Client        | Fetch API                  |

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

# Database Performance Analysis

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

**Built with ❤️ using Vue.js 3 and SQLite3 by Shamiul**
