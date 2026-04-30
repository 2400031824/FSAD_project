# Frontend and Backend Split

## Frontend Repo

Keep these in the frontend repository:

- `client/`
- `shared/`
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.js`
- `tsconfig.json`
- `components.json`
- `vercel.json`
- `.env.frontend.example`

Set this on Vercel:

```text
VITE_API_URL=https://your-railway-backend.up.railway.app
```

The React app now redirects every `/api/...` fetch to `VITE_API_URL` when that variable exists.

## Backend Repo

Keep the `backend/` folder as its own repository.

Run locally:

```bash
cd backend
mvn spring-boot:run
```

Deploy to Railway with MySQL attached and the environment variables from `backend/README.md`.
