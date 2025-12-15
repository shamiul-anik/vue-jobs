# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Vue Jobs is a full-stack TypeScript job board application with:
- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS
- **Backend**: Express.js (TypeScript) + SQLite3
- **Authentication**: JWT with bcryptjs
- **Security**: Helmet.js, rate limiting, input validation (express-validator)
- **Database**: SQLite3 with WAL mode and query optimization

The project has recently been migrated from JavaScript to TypeScript. See TYPESCRIPT_MIGRATION.md for migration details.

## Development Commands

### Running the Application

```powershell
# Install dependencies (first time setup)
npm install

# Start both backend API server and frontend dev server (recommended)
npm start

# Run servers separately
npm run server    # Backend API on http://localhost:3000
npm run dev       # Frontend on http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```powershell
# Build and run with Docker Compose
docker-compose up --build

# Run without building
docker-compose up
```

- Frontend: http://localhost:80
- Backend API: http://localhost:3000

### Database & Performance

```powershell
# Run database benchmark test
npm run db:benchmark

# API load testing with autocannon (requires backend running)
npx autocannon -c 100 -d 10 http://localhost:3000/api/jobs
```

### TypeScript Type Checking

```powershell
# Run type checker without emitting files
npx vue-tsc --noEmit
```

## Architecture Overview

### Project Structure

The codebase follows a clean separation between frontend and backend:

```
vue-jobs/
├── db/                      # Database layer
│   └── database.ts          # SQLite connection, schema, sample data
├── routes/                  # Express API routes
│   ├── jobs.ts              # Job CRUD operations + validation
│   └── users.ts             # Authentication (register/login)
├── server.ts                # Express server entry point
├── src/                     # Vue frontend
│   ├── composables/         # Shared reactive logic
│   │   ├── useAuth.ts       # Global auth state (singleton pattern)
│   │   └── useSEO.ts        # Dynamic meta tags
│   ├── services/            # API communication layer
│   │   └── api.ts           # Fetch-based REST client
│   ├── router/              # Vue Router configuration
│   ├── components/          # Reusable Vue components
│   └── views/               # Page-level components
```

### Backend Architecture

**Database (db/database.ts)**
- SQLite3 with WAL (Write-Ahead Logging) mode for concurrency
- Synchronous NORMAL pragma for optimized writes
- Indexed queries on `created_at` for performance
- Auto-creates admin user (`admin@mail.com` / `admin`) and test user (`test@mail.com` / `testuser`)

**API Routes**
- `routes/jobs.ts`: Full CRUD with express-validator rules
- `routes/users.ts`: JWT-based authentication with bcrypt password hashing
- All routes follow TypeScript interfaces for type safety

**Security Middleware (server.ts)**
- Helmet.js for HTTP security headers
- Rate limiting: 100 requests/15 minutes globally
- Stricter write rate limiting: 50 requests/15 minutes for POST/PUT/DELETE
- CORS enabled for cross-origin requests
- Input sanitization via express-validator

### Frontend Architecture

**State Management**
- `useAuth()` composable provides global authentication state (singleton pattern)
- Reactive state shared across all components
- JWT token and user data persisted in localStorage

**API Service Layer**
- `src/services/api.ts` abstracts all fetch calls
- Type-safe interfaces for `JobData` and API responses
- Error handling with custom `APIError` interface

**Routing**
- Vue Router with history mode
- Dynamic routes for job details (`:id`) and editing
- Lazy-loaded auth views (Login/Register)
- 404 catch-all route

**SEO & Accessibility**
- `useSEO()` composable for dynamic meta tags
- Schema.org structured data (JobPosting, WebSite)
- Open Graph and Twitter Card support
- ARIA labels and semantic HTML throughout

## Key Development Patterns

### TypeScript Conventions
- All `.ts` files use strict mode
- Vue components use `<script setup lang="ts">` with Composition API
- Props defined with `defineProps<{ ... }>()`
- Emits use type-safe `defineEmits<{ ... }>()`
- Interfaces defined inline or imported from service layer

### Database Operations
- Always use parameterized queries (e.g., `db.run(query, [param1, param2])`)
- Database methods use callback-based API (not promises)
- Error handling via callback's first parameter: `(err, result) => { ... }`

### API Validation
When adding new API endpoints:
1. Define validation rules array using `express-validator`
2. Use the `validate` middleware to check results
3. Return 400 with error array for validation failures
4. Always sanitize with `.trim()` and `.escape()` where appropriate

Example pattern:
```typescript
const validationRules = [
  body('field').trim().isLength({ min: 3 }).escape()
];

router.post('/', validationRules, validate, (req, res) => { ... });
```

### Authentication Flow
1. Frontend calls `/api/users/login` or `/api/users/register`
2. Backend validates, hashes password (register) or compares hash (login)
3. JWT token issued with `jsonwebtoken.sign()`
4. Frontend stores token and user data via `useAuth().login()`
5. Token automatically included in future requests (not implemented yet - manual inclusion needed)

### Component Patterns
- Use `ref<T>()` for reactive primitive values
- Use `reactive<T>()` for complex objects
- Use `computed()` for derived state
- Always type composable return values
- Modal component is reusable with `type` and `variant` props

## Environment Variables

Create a `.env` file for JWT configuration:
```
JWT_SECRET=your_super_secret_key
PORT=3000
```

**Important**: The JWT_SECRET defaults to a development key if not provided. Always set this in production.

## Testing Credentials

Auto-generated users (created on first database initialization):
- **Admin**: admin@mail.com / admin
- **Test User**: test@mail.com / testuser

## Important Notes

- This codebase uses ESM modules (`"type": "module"` in package.json)
- All imports must include `.js` extension even in TypeScript files (e.g., `import db from "./db/database.js"`) due to ESM resolution
- The database file `db/database.db` is auto-generated on first run
- Rate limiting is intentionally aggressive - adjust in `server.ts` if needed for development
- WAL mode creates `database.db-wal` and `database.db-shm` files - this is normal
- Vite proxy forwards `/api` requests from frontend to backend during development

## Common Workflows

### Adding a New API Endpoint
1. Add route in `routes/jobs.ts` or `routes/users.ts`
2. Define TypeScript interface for request body
3. Create validation rules with express-validator
4. Implement database query with parameterized SQL
5. Update `src/services/api.ts` with corresponding method
6. Add TypeScript interface for response if needed

### Creating a New Vue Component
1. Create component in `src/components/` or `src/views/`
2. Use `<script setup lang="ts">` for Composition API
3. Define props with `defineProps<PropsInterface>()`
4. Import and use composables (`useAuth`, `useSEO`, `useRouter`)
5. Ensure proper TypeScript typing for all reactive state

### Modifying Database Schema
1. Edit schema in `db/database.ts` in `initializeDatabase()` function
2. Delete `db/database.db` file to force recreation
3. Update TypeScript interfaces in relevant files (api.ts, jobs.ts, etc.)
4. Restart the server to apply changes

### Working with Authentication
- Access auth state via `const { user, isAuthenticated, login, logout } = useAuth()`
- Check authentication status with `isAuthenticated.value`
- Access current user with `user.value` (includes id, name, email, role)
- Always logout via `logout()` method to clear localStorage and reactive state
