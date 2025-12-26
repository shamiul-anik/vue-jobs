# 🌐 Google Cloud 'Always Free' Deployment Guide

This guide will help you set up your **Vue Jobs** application on a Google Cloud `e2-micro` instance. This setup provides a permanent home for your project with full SQLite database persistence at $0.00 cost.

## Step 1: Create the Virtual Machine (VM)

1.  Log in to [Google Cloud Console](https://console.cloud.google.com/).
2.  Go to **Compute Engine** > **VM Instances** > **Create Instance**.
3.  **Region**: Select `us-central1` (Iowa), `us-west1` (Oregon), or `us-east1` (South Carolina).
4.  **Machine configuration**:
    - Series: `E2`
    - Machine type: `e2-micro` (This is the **Always Free** tier).
5.  **Boot Disk**: (Default) 10GB or up to 30GB Standard Persistent Disk.
6.  **Firewall**: Check both **Allow HTTP traffic** and **Allow HTTPS traffic**.
7.  Click **Create**.

## Step 2: Initial Server Setup

Click the **SSH** button next to your instance to open the terminal.

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Git
sudo apt install git -y

# Install Node.js (v22)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager for 24/7 uptime)
sudo npm install -g pm2
```

## Step 3: Deployment & Build

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/vue-jobs.git
cd vue-jobs

# Install dependencies
npm install

# Create environment variables
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
echo "PORT=3000" >> .env
echo "VITE_POSTHOG_HOST=https://us.i.posthog.com" >> .env
echo "VITE_POSTHOG_KEY=your_key_here" >> .env

# Build the frontend
npm run build

# Start the server with PM2
pm2 start server.js --name "vue-jobs"
pm2 save
pm2 startup # Follow the instructions it outputs to enable auto-restart
```

## Step 4: Nginx Reverse Proxy (Exposing to the Web)

Current the app is on port 3000. Nginx will route port 80 (HTTP) to 3000.

```bash
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/vue-jobs
```

**Paste this configuration**:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Activate and Reload**:

```bash
sudo ln -s /etc/nginx/sites-available/vue-jobs /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: SSL (HTTPS) - Optional but Recommended

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d YOUR_DOMAIN
```

---

### Why this is better than Render Free Tier:

- **Persistence**: Your `database.db` file stays on the disk. It is **never deleted**.
- **Backups**: Your `scripts/backup-db.js` interval will actually work and save files locally.
- **Speed**: No "cold starts." Your server is always hot and responds instantly.
- **Learning**: You are now running a real production Linux server!
