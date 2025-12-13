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
- **Security Enhanced**:
  - **Helmet.js** for secure HTTP headers
  - **Rate Limiting** to prevent abuse (100 req/15min)
  - **Input Validation** & Sanitization (express-validator)
  - **CORS** configured for safety
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

- Node.js (v14 or higher)
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

## 📁 Project Structure

```
testing-vue/
├── db/
│   ├── database.js          # Database connection and initialization
│   └── database.db          # SQLite database file (auto-generated)
├── routes/
│   └── jobs.js              # API routes for jobs
├── src/
│   ├── assets/
│   │   └── styles.css       # Tailwind CSS styles
│   ├── components/
│   │   ├── Navbar.vue       # Navigation component
│   │   └── JobCard.vue      # Job card component
│   ├── views/
│   │   ├── HomeView.vue     # Home page
│   │   ├── JobsView.vue     # All jobs listing
│   │   ├── JobView.vue      # Single job details
│   │   ├── AddJobView.vue   # Add new job form
│   │   ├── EditJobView.vue  # Edit job form
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

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

MIT

---

**Built with ❤️ using Vue.js 3 and SQLite3 by Shamiul**
