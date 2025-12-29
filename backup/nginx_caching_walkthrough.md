# Nginx API Caching Implementation Walkthrough

This document outlines the implementation of Nginx-level API caching for the Vue Jobs application. This feature significantly improves read performance while maintaining data freshness through automatic cache invalidation.

## 🎯 Architecture Overview

The caching system is built on three pillars:

1.  **Nginx Configuration**: Defines the cache storage zone and caching rules.
2.  **Backend Logic**: Signals when to invalidate the cache.
3.  **Docker Setup**: Ensures the cache directory exists and permissions are correct.

---

## 🛠️ Implementation Details

### 1. Nginx Configuration

**File**: `nginx/nginx.conf` (New)

- **Purpose**: Defines the `proxy_cache_path` in the `http` block. This is required by Nginx to allocate memory and disk space for the cache.
- **Settings**: 10MB keys zone, 100MB max size, 5-minute inactivity timeout.

**File**: `nginx/default.conf` (Updated)

- **Purpose**: Applies the cache to the `/api` location.
- **Rules**:
  - **Cache**: `GET` and `HEAD` requests for 5 minutes (`200 OK`).
  - **Bypass (Don't Cache)**:
    - Authenticated requests (checked via `cookie_token` or `Authorization` header).
    - Write operations (`POST`, `PUT`, `DELETE`).
  - **Invalidate**: Checks for `X-Cache-Invalidate` header from the upstream backend.

### 2. Backend Cache Invalidation

**File**: `routes/jobs.js`

- **Change**: Added `res.set("X-Cache-Invalidate", "true")` to the success responses of:
  - `POST /` (Create Job)
  - `PUT /:id` (Update Job)
  - `DELETE /:id` (Delete Job)

**How it works**:
When an admin modifies data, the backend sends this custom header. Nginx detects it via `proxy_cache_bypass $upstream_http_x_cache_invalidate`, forcing the _next_ request to skip the cache and fetch fresh data (which typically re-populates the cache).

### 3. Docker Integration

**File**: `Dockerfile.frontend`

- **Change**: Added `RUN mkdir -p /var/cache/nginx/api` to ensure the cache directory exists inside the container.
- **Change**: Copies the new `nginx.conf` and `default.conf` to the correct locations.

---

## 🔍 Verification

You can verify the caching behavior using `curl` or browser DevTools.

### 1. Check Cache Status

Run existing instance or start with `docker compose up -d`.

```bash
# 1. First request (Miss)
# Note: Windows PowerShell users: use 'curl.exe' instead of 'curl'
curl -I http://localhost/api/jobs
# Expected: X-Cache-Status: MISS

# 2. Second request (Hit)
curl -I http://localhost/api/jobs
# Expected: X-Cache-Status: HIT
```

### 2. Check Invalidation

1.  Log in as Admin.
2.  Create, Update, or Delete a job.
3.  Immediately check the list again.

```bash
# After a write operation
curl -I http://localhost/api/jobs
# Expected: X-Cache-Status: BYPASS (or MISS, ensuring fresh data)
```

---

## ⚠️ Notes for Development

- **Local Development**: If running via `npm run dev` (Vite proxy), Nginx caching is NOT active. This only applies to the Docker production build.
- **Browser Caching**: The API cache is on the _server_ (Nginx). Browsers might still cache locally if headers allow, but our Nginx config forces revalidation for the API if needed.
