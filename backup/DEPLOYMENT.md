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

## 🚀 Recommended Option: VPS (DigitalOcean, Linode, AWS EC2)

**Yes! A VPS is actually the _best_ place to host this specific application.**

Because you are using **SQLite**, a VPS (Virtual Private Server) is perfect because it gives you a **persistent filesystem** by default. You don't need to pay extra for "Volumes" or "Disks" like on Railway/Render.

### Setup Overview (Ubuntu Example)

1.  **Get a VPS**: Buy a small instance ($5-6/mo) from DigitalOcean, Linode, or Hetzner.
2.  **Install Node.js**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
3.  **Clone Project**: `git clone <your-repo-url>`
4.  **Install Dependencies**: `npm install`
5.  **Build Frontend**: `npm run build`
6.  **Run with PM2**:
    Use PM2 to keep your server running forever.
    ```bash
    npm install -g pm2
    pm2 start server.js --name "vue-jobs"
    pm2 save
    ```
7.  **Configure Nginx (Reverse Proxy)**:
    - Serve the `dist` folder as static files.
    - Proxy requests to `/api` to `localhost:3000`.

**Pros**: Control, Performance, Cheap, Persistent SQLite.
**Cons**: Manual setup (SSH, Linux commands).

---

## 🏁 Comparison

| Feature              | Railway / Render (Paid) | Vercel / Netlify (Free)    |
| :------------------- | :---------------------- | :------------------------- |
| **Effort**           | Low (Lift & Shift)      | High (Rewrite DB layer)    |
| **Database**         | SQLite (File)           | Must migrate to Cloud DB   |
| **Performance**      | Good                    | Excellent (Edge caching)   |
| **Data Persistence** | ✅ Yes (With Volume)    | ❌ No (Unless external DB) |

**Recommendation**: For a portfolio project using SQLite, **Railway** is often the smoothest experience. For mastering Vercel, we can migrate the DB to **Turso** (LibSQL) which is compatible with SQLite code but runs in the cloud.
