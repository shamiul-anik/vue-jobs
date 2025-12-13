# Deployment Guide

This application uses **Vue.js 3** (Frontend) and **Node.js/Express + SQLite** (Backend).

## ⚠️ Important Warning for Vercel Deployment

**It cannot be deployed to Vercel "as is" because of the SQLite database.**

- **Reason**: Vercel is a "Serverless" platform. It freezes/destroys server between requests. This means the `database.db` file (SQLite) will be reset effectively on every new deployment or cold start. **All the data will be lost.**
- **Solution**: To use Vercel, we must host the database somewhere else (like Vercel Postgres, Turso, or Supabase).

---

## ✅ Recommended Option: Deploy to Railway or Render

For this specific project structure (Node.js + Local SQLite file), the easiest way to deploy without code changes is to use a service that supports **Persistent Disk Storage**.

### Option 1: Railway (Easiest)

1.  Push code to GitHub.
2.  Sign up at [railway.app](https://railway.app/).
3.  Click "New Project" -> "Deploy from GitHub repo".
4.  Railway will detect the Node.js app.
5.  **Critical**: Add a **Volume** (Persistent Disk) and mount it to `/app/db`. This ensures `database.db` is saved even when the app restarts.
6.  Update the `PORT` variable if needed (Railway handles this automatically usually).

### Option 2: Render

1.  Push code to GitHub.
2.  Sign up at [render.com](https://render.com/).
3.  Create a "Web Service".
4.  **Critical**: We must add a **Disk** to the service plan to persist the `database.db` file. (Note: The free tier of Render does not support persistent disks, so the data will reset on restart unless we pay).

---

## 🛠️ Static/Serverless Options: Vercel & Netlify (Requires Code Changes)

Both **Vercel** and **Netlify** are optimized for static sites and serverless functions. They share the same limitation: **No persistent file storage**.

If we _must_ use Vercel or Netlify, we need to split our app:

### 1. Frontend (Vue) -> Vercel / Netlify

1.  **Vercel**: Use `vercel.json` (as above).
2.  **Netlify**: Create `_redirects` file in `public` folder:
    ```
    /*  /index.html  200
    ```
3.  Run `npm run build`.
4.  Deploy the `dist` folder.
5.  **Problem**: This frontend needs an API to talk to.

### 2. Backend (Express + DB) -> External Host

We cannot host the SQLite database on Vercel or Netlify. We must:

1.  Host `server.js` on Railway/Render/Heroku.
2.  OR migrate to a cloud database (Turso/Supabase/ElephantSQL) and rewrite `db/database.js`.

---

## 🏁 Comparison

| Feature              | Railway / Render (Paid) | Vercel / Netlify (Free)    |
| :------------------- | :---------------------- | :------------------------- |
| **Effort**           | Low (Lift & Shift)      | High (Rewrite DB layer)    |
| **Database**         | SQLite (File)           | Must migrate to Cloud DB   |
| **Performance**      | Good                    | Excellent (Edge caching)   |
| **Data Persistence** | ✅ Yes (With Volume)    | ❌ No (Unless external DB) |

**Recommendation**: For a portfolio project using SQLite, **Railway** is often the smoothest experience. If we want to master Vercel, try migrating the DB to **Turso** (LibSQL) which is compatible with SQLite code but runs in the cloud.
