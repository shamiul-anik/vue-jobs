# 🚀 Vue Jobs - Full Stack Application

> A production-ready, full-stack job board system built with **Vue.js 3** and **Node.js**.

This project demonstrates a robust, scalable architecture using **Vue 3 (Composition API)** for the frontend and **Express.js** for the RESTful backend. It features a high-performance **SQLite3** database (optimized with WAL mode), secure **JWT Authentication**, and is fully containerized with **Docker** and **Nginx** for easy deployment.

Designed with a focus on code quality, security, and performance, it includes advanced features like rate limiting, input validation, and responsive Tailwind CSS design.

---

## ✨ Key Features

### 🏗️ Core Architecture

- **Vue 3**: Leveraging the Composition API for modular, reusable logic.
- **Vite**: Lightning-fast development server and optimized production builds.
- **Express.js**: Robust REST API handling job listings and user management.
- **SQLite3**: ACID-compliant persistence with optimization tuning (WAL Mode, Indexes).

### 🔐 Security & Auth

- **JWT Authentication**: Secure, stateless session management.
- **Bcrypt**: Industry-standard password hashing.
- **Helmet.js**: Sets secure HTTP headers.
- **Rate Limiting**: Protects against brute-force and DDoS attacks (e.g., 100 req/15min).
- **Input Validation**: Server-side data sanitization with `express-validator`.

### 🐳 DevOps & Deployment

- **Dockerized**: specific `Dockerfile` for Backend and Multi-stage build for Frontend.
- **Nginx**: Production-grade reverse proxy and static asset server.
- **Docker Compose**: One-command orchestration for the entire stack.

### 🎨 UI/UX

- **Responsive Design**: Mobile-first layout using **Tailwind CSS**.
- **Interactive Elements**: Modal confirmations, toast notifications, and dynamic routing.
- **Accessibility**: Semantic HTML and ARIA labels.

---

## 🛠️ Technology Stack

| Domain       | Technology        | Description                        |
| :----------- | :---------------- | :--------------------------------- |
| **Frontend** | Vue.js 3          | Composition API, `<script setup>`  |
| **Routing**  | Vue Router 4      | History mode, Navigation Guards    |
| **State**    | Reactivity API    | `useAuth` composable pattern       |
| **Styling**  | Tailwind CSS      | Utility-first CSS framework        |
| **Backend**  | Node.js + Express | RESTful API server                 |
| **Auth**     | JWT + bcryptjs    | Secure authentication flow         |
| **Database** | SQLite3           | Local SQL DB with optimized config |
| **DevOps**   | Docker + Compose  | Containerization & Orchestration   |
| **Server**   | Nginx             | Reverse Proxy & Static Server      |
| **HTTP**     | Fetch API         | Native modern AJAX requests        |

---

## 📁 Project Structure

```bash
vue-jobs/
├── db/                  # Database layer
│   ├── database.js      # Connection pooling & Schema init
│   └── database.db      # SQLite file (auto-generated)
├── nginx/               # Web Server Config
│   └── default.conf     # Nginx proxy & routing rules
├── routes/              # API Endpoints
│   ├── jobs.js          # Job CRUD operations
│   └── users.js         # Auth routes (Login/Register)
├── src/                 # Frontend Source
│   ├── components/      # Reusable UI widgets (Navbar, JobCard)
│   ├── composables/     # Shared state logic (useAuth)
│   ├── services/        # API integration layer
│   └── views/           # Page interactions (Home, JobDetails)
├── Dockerfile           # Backend Container Config
├── Dockerfile.frontend  # Frontend Container Config
├── docker-compose.yml   # Stack Orchestration
└── server.js            # Entry point for Node backend
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** (v22+)
- **npm** or **yarn**
- **Docker Desktop** (Optional, for containerized run)

### 📥 1. Installation

```bash
# Clone the repository
git clone https://github.com/shamiul-anik/vue-jobs.git
cd vue-jobs

# Install dependencies (Local Dev only)
npm install
```

### 🏃 2. Running the Application

You have three ways to run the project:

#### A. Docker (Recommended for Production/Clean Test)

Spins up the entire stack (Frontend + Backend + Database) in isolated containers.

```bash
# Build and Start
docker-compose up --build

# Run in background
docker-compose up -d
```

> **Access:** Frontend at `http://localhost` | Backend at `http://localhost:3000`

#### B. Concurrent Mode (Recommended for Dev)

Runs both servers in a single terminal.

```bash
npm start
```

#### C. Separate Terminals (Manual)

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run dev
```

---

## 🔑 Default Credentials

The system automatically seeds these users on the first run:

### 🛡️ Admin User

_Can Edit/Delete jobs_

- **Email**: `admin@mail.com`
- **Password**: `admin`

### 👤 Test User

_Standard access_

- **Email**: `test@mail.com`
- **Password**: `testuser`

---

## 🔌 API Documentation

| Method     | Endpoint              | Description                   | Auth Required |
| :--------- | :-------------------- | :---------------------------- | :------------ |
| **GET**    | `/api/jobs`           | Retrieve full list of jobs    | No            |
| **GET**    | `/api/jobs/:id`       | Get details of a specific job | No            |
| **POST**   | `/api/jobs`           | Create a new job listing      | Yes (Admin)   |
| **PUT**    | `/api/jobs/:id`       | Update an existing job        | Yes (Admin)   |
| **DELETE** | `/api/jobs/:id`       | Remove a job listing          | Yes (Admin)   |
| **POST**   | `/api/users/register` | Register a new user           | No            |
| **POST**   | `/api/users/login`    | Authenticate & Get Token      | No            |

---

## 📊 Performance Benchmarks

We take performance seriously. Using `autocannon` and custom scripts, we've benchmarked the system:

- **Database Write Speed**: ~27,500 Ops/sec (Raw SQLite Insert)
- **Database Read Speed**: ~19,600 Ops/sec (Raw SQLite Select)
- **API Throughput**: ~3,600 Req/sec (Full stack load test)
- **Latency**: ~27ms average response time

> **Note**: High failure rates in stress tests are **expected** due to our security Rate Limiter (100 req/15min) actively blocking flooding attempts.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Shamiul
</p>
