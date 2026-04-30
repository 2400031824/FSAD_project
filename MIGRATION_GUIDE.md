# FSAD Project - Frontend & Backend Separation Guide

## Overview
Current structure: Full-stack in one folder
New structure: TWO separate repositories

```
Current (❌ Wrong for your marks):
FSAD_project/
├── server/ (Node.js - wrong!)
├── client/ (React)
└── shared/

New (✅ Correct for your marks):
FSAD-Frontend/ (separate repo)
└── src/

FSAD-Backend/ (separate repo)
└── backend/
```

## Step 1: Create Frontend Repository

### 1.1 Create New Folder for Frontend Repo
```bash
# Create a new folder outside your current project
mkdir C:\path\to\FSAD-Frontend
cd C:\path\to\FSAD-Frontend
git init
```

### 1.2 Copy Frontend Files
Copy these folders from your current project:
- `client/` → Copy everything inside to FSAD-Frontend/
- `shared/` → Copy to FSAD-Frontend/shared/

```bash
cp -r client/* .
cp -r ../FSAD_project/shared ./
```

### 1.3 Create Frontend .gitignore
```
node_modules/
dist/
.env.local
.env.*.local
*.log
.DS_Store
.vscode/
```

### 1.4 Create Frontend package.json (update from current)
Edit `package.json` to include only frontend dependencies:

```json
{
  "name": "fsad-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "check": "tsc"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.60.5",
    "@supabase/supabase-js": "^2.97.0",
    "@radix-ui/react-*": "*",
    "tailwindcss": "^3.3.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.3",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31"
  }
}
```

### 1.5 Create API Configuration
Create `src/lib/api.ts`:

```typescript
// API base URL - change based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Example: Login API call
export async function login(username: string, password: string) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  // Save token
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('role', data.role);
  
  return data;
}
```

### 1.6 Create .env File
Create `.env`:

```
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_API_KEY=your_key_here
```

For production (create `.env.production`):
```
VITE_API_URL=https://your-backend.railway.app/api
```

### 1.7 Frontend Repository Setup Complete
```bash
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## Step 2: Create Backend Repository

Backend is already created in your project! Just extract it:

### 2.1 Extract Backend Files
```bash
# Create new backend repo folder
mkdir C:\path\to\FSAD-Backend
# Copy backend folder from FSAD_project
cp -r ../FSAD_project/backend C:\path\to\FSAD-Backend
```

### 2.2 Backend Repository Complete
Already set up! See `backend/README.md` for running instructions.

---

## Step 3: Update Frontend to Call Backend

### 3.1 Update Authentication Hook
Edit `src/hooks/use-auth.ts`:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiCall, login as apiLogin } from '@/lib/api';

export function useAuth() {
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await apiLogin(credentials.username, credentials.password);
    },
    onSuccess: (data) => {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
```

### 3.2 Update Jobs Hook
Edit `src/hooks/use-jobs.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib/api';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      return await apiCall('/jobs');
    },
  });
}
```

### 3.3 Update Applications Hook
Edit `src/hooks/use-applications.ts`:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiCall } from '@/lib/api';

export function useApplications() {
  const applyMutation = useMutation({
    mutationFn: async (data: { jobId: number; studentId: number }) => {
      return await apiCall('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  return {
    apply: applyMutation.mutate,
    isLoading: applyMutation.isPending,
  };
}
```

---

## Step 4: Repository Structure on GitHub

### 4.1 Create GitHub Repositories

Create two new repositories on GitHub:
1. `FSAD-Frontend` - React/TypeScript frontend
2. `FSAD-Backend` - Spring Boot backend

### 4.2 Push Frontend
```bash
cd FSAD-Frontend
git add .
git commit -m "Initial frontend setup"
git remote add origin https://github.com/YOUR_USERNAME/FSAD-Frontend.git
git push -u origin main
```

### 4.3 Push Backend
```bash
cd FSAD-Backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/YOUR_USERNAME/FSAD-Backend.git
git push -u origin main
```

---

## Step 5: Deployment

### 5.1 Deploy Backend to Railway

**Option A: Via GitHub**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repo (FSAD-Backend)
4. Select repo and main branch
5. Railway auto-detects Maven project
6. Add MySQL plugin
7. Set environment variables:
   ```
   JWT_SECRET=your-secret-key-here
   ```
8. Deploy! Backend URL: `https://your-app.railway.app/api`

**Option B: Manual Deployment
```bash
cd backend
# Build JAR
mvn clean package

# This creates: target/fsad-backend-1.0.0.jar
# Upload to Railway or any Java hosting
```

### 5.2 Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo (FSAD-Frontend)
3. Set build command: `npm run build`
4. Set environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. Deploy!

Frontend URL: `https://your-app.vercel.app`

---

## Step 6: Verify Everything Works

### Test Backend
```bash
# Start backend locally
mvn spring-boot:run

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"Password123"}'
```

### Test Frontend
```bash
# Start frontend locally
npm run dev
# Visit http://localhost:5173
# Login with credentials
# Should call backend at http://localhost:8080/api
```

### Production Check
```bash
# Update frontend .env.production
VITE_API_URL=https://your-backend.railway.app/api

# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod
```

---

## Final Project Structure

```
GitHub:
  ├── FSAD-Frontend (React repo)
  │   ├── src/
  │   ├── package.json
  │   ├── vite.config.ts
  │   ├── .env
  │   └── .env.production
  │
  └── FSAD-Backend (Spring Boot repo)
      ├── src/
      ├── pom.xml
      ├── application.yml
      └── Dockerfile (optional)

Deployed:
  ├── Frontend: https://your-app.vercel.app (Vercel)
  └── Backend: https://your-app.railway.app/api (Railway)
```

---

## Troubleshooting

**Frontend can't connect to backend?**
- Check `VITE_API_URL` in `.env`
- Check CORS settings in backend `SecurityConfig.java`
- Verify backend is running: `curl http://localhost:8080/api/jobs`

**Login doesn't work?**
- Check if token is being saved to localStorage
- Verify JWT token in browser DevTools Console:
  ```javascript
  console.log(localStorage.getItem('token'));
  ```

**Deployment fails?**
- Backend: Check `pom.xml` and `application.yml`
- Frontend: Check `package.json` and `vite.config.ts`
- Verify environment variables are set on hosting platform

---

## What You've Accomplished ✅
- ✅ Spring Boot backend (Java 21 + Spring Boot 3.x)
- ✅ Separate frontend repository
- ✅ Separate backend repository
- ✅ JWT authentication with Spring Security
- ✅ MySQL database integration
- ✅ CORS properly configured
- ✅ Ready for deployment

Now you have TWO repos with proper separation of concerns - this will show your understanding of full-stack architecture! 🎉
