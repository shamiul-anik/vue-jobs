# Uses of SQLite3

SQLite3 is a **lightweight, embedded relational database**. Instead of running as a separate server (like MySQL or PostgreSQL), it stores the entire database in a **single file** and runs inside your application process.

Below is a **clear, practical breakdown of SQLite3 uses**, including **when it’s a good choice and when it’s not**.

---

## Common & Practical Uses of SQLite3

### 1️⃣ Local application data storage

Very common for:

- Desktop apps (Windows / macOS / Linux)
- Mobile apps (Android & iOS)
- CLI tools

**Examples**

- App settings & preferences
- User profiles
- Offline data cache

👉 **Why SQLite?**

- Zero setup
- No server needed
- Fast for local reads/writes

---

### 2️⃣ Web applications (small to medium scale)

SQLite works well for:

- Personal projects
- MVPs
- Small SaaS apps
- Admin dashboards
- Job boards, blogs, CMS

**Typical stack**

```text
Frontend: Vue / React / Next
Backend: Node.js / Express / Laravel / Django
Database: SQLite3
```
