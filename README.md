## 🚀 Placement Interaction System
FSAD – PS14 | Full Stack Application Development

A role‑based full‑stack web application designed to modernize campus recruitment workflows. It replaces spreadsheet‑driven chaos with a secure, lifecycle‑driven process that keeps students, employers, officers, and admins in sync.

---

## 📌 Overview
Traditional placement systems suffer from:

- No real‑time visibility for students
- Manual tracking by placement officers
- Unstructured employer updates
- Fragmented communication and poor accountability

This platform introduces a controlled application lifecycle (Applied → Shortlisted → Selected/Rejected) enforced by backend RBAC. Employers update statuses, students receive instant feedback, and officers monitor overall progress.

---

## 🧱 Architecture & Technologies

```
/ (root)
├── client/       # React + Vite frontend (shadcn/ui, Tailwind)
├── server/       # Express API in TypeScript
├── shared/       # Zod schemas and route definitions
├── migrations/   # Drizzle SQL migrations
└── Data/         # SQLite database file (dev)
```

| Layer     | Stack                          |
|-----------|-------------------------------|
| Frontend  | React 18 · Vite · TailwindCSS · shadcn/ui · React Query |
| Backend   | Node 20 · Express · TypeScript · Drizzle ORM · SQLite |
| Auth      | express-session + cookies (SESSION_SECRET) |
| Build     | esbuild & Vite (`npm run build`) |

---

## 👥 User Roles & Features

| Role                | Capabilities                                      |
|---------------------|---------------------------------------------------|
| **Admin**           | Manage users, approve/block employers, view stats |
| **Student**         | Register/login, upload resume, apply, track status |
| **Employer**        | Post jobs, review applicants, update statuses     |
| **Placement Officer** | Monitor placements, view aggregated analytics     |

All API routes validate authentication and enforce role restrictions.

---

## 🔍 Core Features

- Lifecycle‑driven status updates
- Role‑based access control (RBAC) enforced server‑side
- Resume upload (PDF/DocX) with storage abstraction
- Dashboard pages with color‑coded badges and charts
- JWT‑free, session‑based authentication with secure cookies
- SQLite database for easy local development; migrate with Drizzle
- Type‑safe shared schemas via Zod and `@shared` imports

---

## 🧩 Setup & Usage

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/placement-interaction-system.git
   cd FSAD_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Copy `.env.example` to `.env` and set:
   ```env
   SESSION_SECRET=some-long-random-string
   PORT=3000        # optional
   ```

4. **Development server**
   ```bash
   npm run dev
   ```
   This command starts both the backend and the Vite frontend on a single port (default 3000).

5. **Production build & run**
   ```bash
   npm run build   # bundles client/server to dist/
   npm start       # serve from dist/
   ```

6. **Database migrations**
   - Modify `shared/schema.ts`, then run:
     ```bash
     npm run db:push
     ```
   - The SQLite file is located in `Data/db.sqlite`.

7. **Type checking**
   ```bash
   npm run check
   ```

---

## 🗄 Sample Data

Migrations include seed logic. On first run the database is populated with example users, jobs, and applications so you can explore the app without manual entry.

---

## 🔧 Maintenance & Cleanup

Legacy configuration files (Prisma, Docker‑Compose, PostgreSQL examples) have been removed. The current stack uses only Drizzle + SQLite for simplicity.

Unnecessary directories such as `attached_assets/` and `prisma/` have been deleted.

---

## 🔮 Future Enhancements

- Multi‑round interview workflow engine
- AI‑assisted resume screening
- WebSocket notifications for real‑time updates
- Advanced analytics dashboards
- Dockerized production deployment support

---

## � Deployment

The application can be deployed anywhere that can run a Node 20 container. Two common approaches:

1. **Docker (recommended)**
   - Build the image:
     ```bash
     docker build -t placement-interaction-system:latest .
     ```
   - Run the container, exposing port 3000:
     ```bash
     docker run --rm -e SESSION_SECRET=your_secret -p 3000:3000 placement-interaction-system:latest
     ```
   - Push to a registry (Docker Hub, GitHub Container Registry) and configure your cloud provider to pull the image.

2. **Cloud platform (Azure/AWS/GCP/Heroku/etc.)**
   - Any provider that supports Node.js can host the compiled server in `dist/`.
   - Set `NODE_ENV=production` and supply a `SESSION_SECRET` via environment variables.
   - Ensure the `Data/db.sqlite` file is persisted (or switch to an external database such as PostgreSQL and update `server/db.ts`).

For **Azure App Service with Docker**:

- Push the image to a container registry.
- Create a Web App for Containers and point it at the image.
- Add `SESSION_SECRET` and optional `PORT` settings in the App Service configuration.

> ⚠️ This repository does not include automated CI/CD; you can add a GitHub Actions workflow to build, test, and deploy on push.


## �📄 License & Credits

Project developed by Siva Raga Adithi Kotapothula, Bhagya Yelleti, and Jayarama Reddy for KL University FSAD.
