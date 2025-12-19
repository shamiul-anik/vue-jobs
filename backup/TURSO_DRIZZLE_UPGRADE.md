# 🚀 Upgrading to Drizzle ORM + Turso DB

Switching to Drizzle and Turso will modernize your data layer, providing type safety and making your application "Edge" ready.

## Why Turso?

- **libSQL powered**: High-performance SQLite fork.
- **Distributed**: Deploy data close to your users.
- **Micro-tier**: Generous free tier for personal projects.

## Why Drizzle?

- **TypeScript First**: No more manual SQL strings in your routes.
- **Migrations**: Automated schema versioning (`drizzle-kit`).
- **Performance**: Zero-overhead ORM.

---

## 🛠️ Proposed Schema (Drizzle)

If you switch, your `db/schema.js` would look like this:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", {
    enum: ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"],
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  salary: text("salary"),
  location: text("location").notNull(),
  companyName: text("company_name"),
  companyDescription: text("company_description"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
```

## 🔄 How to Migrate to Turso

1. **Install dependencies**:

   ```bash
   npm install drizzle-orm @libsql/client
   npm install -D drizzle-kit
   ```

2. **Setup Credentials**:
   Add to `.env`:

   ```env
   TURSO_DATABASE_URL=libsql://your-db-name.turso.io
   TURSO_AUTH_TOKEN=your-token
   ```

3. **Initialize Drizzle**:

   ```javascript
   import { drizzle } from "drizzle-orm/libsql";
   import { createClient } from "@libsql/client";

   const client = createClient({
     url: process.env.TURSO_DATABASE_URL,
     authToken: process.env.TURSO_AUTH_TOKEN,
   });

   export const db = drizzle(client);
   ```

## 📦 Data Migration

You can use the new command I created to prepare your data before pushing to Turso:

```bash
# Import local data into your project DB
npm run db:import ./path/to/backup/database.db
```

Then use Drizzle to push the schema to Turso:

```bash
npx drizzle-kit push:libsql
```
