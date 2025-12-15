# 🚀 Vue Jobs - Monorepo Structure

A full-stack Job Board Application with separated Frontend and Backend folders for better organization and scalability.

## 📁 Project Structure

```
vue-jobs/
├── frontend/                 # Vue.js Frontend Application
│   ├── src/
│   │   ├── components/       # Vue components
│   │   ├── views/            # Page views
│   │   ├── router/           # Vue Router configuration
│   │   ├── services/         # API services
│   │   ├── composables/      # Vue composables
│   │   ├── assets/           # Styles and images
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/               # Static assets
│   ├── index.html            # Entry HTML
│   ├── vite.config.js        # Vite configuration
│   ├── Dockerfile            # Docker config for frontend
│   └── package.json          # Frontend dependencies
│
├── backend/                  # Express.js Backend API
│   ├── server.js             # Server entry point
│   ├── routes/               # API route handlers
│   │   ├── jobs.js
│   │   └── users.js
│   ├── db/                   # Database files and migrations
│   │   └── database.js
│   ├── scripts/              # Utility scripts
│   │   └── benchmark-db.js
│   ├── nginx/                # Nginx configuration
│   └── package.json          # Backend dependencies
│
├── docker-compose.yml        # Docker Compose orchestration
├── package.json              # Root package (orchestration)
└── README.md                 # This file
```

## 🎯 What's Where

### Frontend (`/frontend`)
- **Vue 3** components and views
- **Vue Router** for navigation
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- API service calls to backend

### Backend (`/backend`)
- **Express.js** REST API server
- **SQLite3** database
- User authentication and authorization
- Job management endpoints
- Input validation and security middleware

## 🏃 Quick Start

### Install All Dependencies
```bash
npm run setup
```

### Run Full Development Stack
```bash
npm run dev
```

This runs both frontend and backend concurrently using `concurrently`.

### Run Frontend Only
```bash
npm run frontend:dev
```

### Run Backend Only
```bash
npm run backend:dev
```

### Build Frontend
```bash
npm run build
```

### Benchmark Database
```bash
npm run db:benchmark
```

## 🐳 Docker

### Build and Run with Docker Compose
```bash
docker-compose up --build
```

### Build Individual Containers
```bash
# Frontend
docker build -f frontend/Dockerfile -t vue-jobs-frontend .

# Backend
docker build -f Dockerfile -t vue-jobs-backend .
```

## 📊 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Install dependencies for all packages |
| `npm run dev` | Run frontend and backend together |
| `npm run frontend:dev` | Run frontend only |
| `npm run backend:dev` | Run backend only |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview built frontend |
| `npm run server` | Run backend server |
| `npm run db:benchmark` | Run database benchmark |

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Configuration
PORT=3000
NODE_ENV=development
DB_PATH=./backend/db/database.db

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

## 📝 API Documentation

The backend exposes the following endpoints:

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (authenticated)
- `PUT /api/jobs/:id` - Update job (authenticated)
- `DELETE /api/jobs/:id` - Delete job (authenticated)

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Helmet.js for HTTP headers
- ✅ Rate limiting
- ✅ Input validation with express-validator

## 🗄️ Database

SQLite3 is used as the database for simplicity and easy deployment:
- Single file database storage
- Perfect for MVPs and small to medium projects
- Suitable for one server/single region deployments

## 📦 Technology Stack

### Frontend
- Vue 3
- Vue Router
- Vite
- Tailwind CSS
- Axios/Fetch API

### Backend
- Express.js
- SQLite3
- JWT
- bcryptjs
- Helmet.js

## 🚀 Deployment

### Frontend
Deploy the built files from `frontend/dist/` to any static hosting:
- Netlify
- Vercel
- AWS S3 + CloudFront

### Backend
Deploy the backend to:
- Heroku
- Railway
- AWS EC2
- DigitalOcean
- Docker container services

## 📖 Development Guidelines

1. **Frontend Changes**: Edit files in `/frontend` directory
2. **Backend Changes**: Edit files in `/backend` directory
3. **API Integration**: Update API URLs in frontend services
4. **Database**: Modify SQLite schema in `/backend/db/`

## 🐛 Troubleshooting

### Port Already in Use
Change the PORT in `.env` file or kill the process using port 3000/5173

### Dependencies Issues
Delete `node_modules` and `package-lock.json` in root and respective folders, then run `npm run setup`

### Database Errors
Check `/backend/db/database.db` permissions and ensure SQLite3 is installed

## 📄 License

ISC

---

**Happy Coding!** 🎉
