# Project Structure

## Directory Map

- **.agent/**: Agent rules and context.
- **db/**: Database files and scripts.
  - **db_backup/**: Automated backups.
- **dist/**: Production build artifacts.
- **nginx/**: Nginx configuration for production.
- **public/**: Static assets (images, favicon).
- **routes/**: Express.js API routes (jobs.js, users.js).
- **scripts/**: Utility scripts (backup, migrate, benchmark).
- **src/**: Vue.js source code.
  - **assets/**: CSS, static files.
  - **components/**: Reusable UI components.
  - **composables/**: Logic reuse (auth, jobs, SEO).
  - **router/**: Vue Router config.
  - **services/**: API clients.
  - **views/**: Page components.
- **server.js**: Express server entry point.
- **vite.config.js**: Vite configuration.
