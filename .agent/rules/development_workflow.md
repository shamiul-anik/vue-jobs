# Development Workflow

## Starting the App
- **Concurrent (Recommended)**: 
pm start (Runs Server + Frontend)
- **Backend Only**: 
pm run server (Port 3000)
- **Frontend Only**: 
pm run dev (Port 5173)

## Database
- **Backup**: 
pm run db:backup (Creates simple backup in db/db_backup/)
- **Migrate**: 
pm run db:import <path/to/db> (Import data)
- **Benchmark**: 
pm run db:benchmark`n
## Testing
- **Unit/Component**: 
pm test (Watch mode)
- **Run Once**: 
pm run test -- --run`n- **UI Mode**: 
pm run test:ui`n- **Performance**: 
pm run perf:all (Benchmarks + Load Test)

## Deployment (Docker)
- **Build & Run**: docker-compose up --build`n- **Run**: docker-compose up`n- **Frontend**: http://localhost:80
- **Backend**: http://localhost:3000
