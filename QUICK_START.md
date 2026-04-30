# FSAD Project Migration - QUICK START CHECKLIST

## 🎯 What's Done
- ✅ Spring Boot backend structure created (Java 21 + Spring Boot 3.x)
- ✅ Complete API endpoints (Auth, Jobs, Applications)
- ✅ JWT authentication with Spring Security
- ✅ MySQL database configuration
- ✅ CORS properly configured for frontend
- ✅ Docker support for easy deployment
- ✅ Railway.json for cloud deployment

## 🚀 Immediate Next Steps

### Phase 1: Test Backend Locally (30 mins)

1. **Install Java 21**
   ```bash
   # Download from: https://www.oracle.com/java/technologies/downloads/#java21
   java -version  # Should show Java 21
   ```

2. **Install Maven**
   ```bash
   # Download from: https://maven.apache.org/download.cgi
   mvn -version  # Should show Maven 3.x
   ```

3. **Set Up MySQL Locally**
   - Download MySQL from https://www.mysql.com/downloads/
   - Or use Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.0`
   - Create database:
     ```sql
     CREATE DATABASE fsad_db;
     ```

4. **Update application.yml**
   Edit `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/fsad_db
       username: root
       password: your_mysql_password
   
   jwt:
     secret: change-this-to-a-long-secret-key-32-chars-min
   ```

5. **Build & Run Backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   
   ✅ Backend running at: http://localhost:8080/api

### Phase 2: Test with Postman (15 mins)

1. **Test Registration**
   ```bash
   POST http://localhost:8080/api/auth/register
   Content-Type: application/json
   
   {
     "username": "student1",
     "password": "Password123",
     "email": "student@example.com",
     "name": "John Doe",
     "role": "student"
   }
   ```

2. **Test Login**
   ```bash
   POST http://localhost:8080/api/auth/login
   Content-Type: application/json
   
   {
     "username": "student1",
     "password": "Password123"
   }
   ```
   
   ✅ Copy the `token` from response

3. **Test Protected Endpoint**
   ```bash
   GET http://localhost:8080/api/jobs
   Authorization: Bearer {paste_token_here}
   ```

### Phase 3: Update Frontend (1 hour)

1. **Create API Config File**
   Create `client/src/lib/api.ts` (see MIGRATION_GUIDE.md for code)

2. **Update Hooks to Use Backend**
   - `use-auth.ts` → Call `/api/auth/login`
   - `use-jobs.ts` → Call `/api/jobs`
   - `use-applications.ts` → Call `/api/applications`

3. **Update .env**
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Test Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   
   ✅ Visit http://localhost:5173
   ✅ Try logging in - should call your Spring Boot backend!

### Phase 4: Separate Repos (30 mins)

1. **Create GitHub Repos**
   - New repo: `FSAD-Frontend`
   - New repo: `FSAD-Backend`

2. **Extract Frontend**
   ```bash
   mkdir FSAD-Frontend
   cp -r client/* FSAD-Frontend/
   cd FSAD-Frontend
   git init
   git add .
   git commit -m "Initial frontend setup"
   git remote add origin https://github.com/YOUR_USERNAME/FSAD-Frontend.git
   git push -u origin main
   ```

3. **Extract Backend**
   ```bash
   mkdir FSAD-Backend
   cp -r backend FSAD-Backend/
   cd FSAD-Backend
   git init
   git add .
   git commit -m "Initial backend setup"
   git remote add origin https://github.com/YOUR_USERNAME/FSAD-Backend.git
   git push -u origin main
   ```

### Phase 5: Deploy to Railway (1-2 hours)

1. **Deploy Backend**
   - Sign up at https://railway.app
   - Connect GitHub
   - Select FSAD-Backend repo
   - Railway auto-detects Maven project
   - Add MySQL plugin
   - Set `JWT_SECRET` environment variable
   - Deploy!
   - Copy Railway URL (e.g., `https://fsad-backend.railway.app`)

2. **Deploy Frontend**
   - Sign up at https://vercel.com
   - Connect GitHub
   - Select FSAD-Frontend repo
   - Set environment variable:
     ```
     VITE_API_URL=https://fsad-backend.railway.app/api
     ```
   - Deploy!

---

## 📋 File Locations

**Backend Files Created:**
```
backend/
├── pom.xml                                    # Maven config
├── Dockerfile                                 # Docker for deployment
├── railway.json                               # Railway config
├── README.md                                  # Backend guide
└── src/main/
    ├── java/com/fsad/
    │   ├── FsadBackendApplication.java        # Main app
    │   ├── controller/                        # REST endpoints
    │   ├── service/                           # Business logic
    │   ├── repository/                        # Database
    │   ├── entity/                            # JPA entities
    │   ├── dto/                               # Data transfer objects
    │   └── security/                          # JWT & Security
    └── resources/
        └── application.yml                    # Configuration
```

**Documentation Files:**
```
MIGRATION_GUIDE.md                             # Complete migration guide
```

---

## 🔗 Important Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT token) |
| GET | `/jobs` | Get all jobs |
| POST | `/jobs` | Create new job |
| GET | `/applications` | Get all applications |
| POST | `/applications` | Apply for job |
| PUT | `/applications/{id}` | Update application status |

---

## ✅ Verification Checklist

- [ ] Java 21 installed and verified
- [ ] Maven installed and verified
- [ ] MySQL set up locally or on Railway
- [ ] Backend builds successfully (`mvn clean install`)
- [ ] Backend runs on http://localhost:8080/api
- [ ] Can register user via API
- [ ] Can login and get JWT token
- [ ] Frontend updated to call backend
- [ ] Frontend runs at http://localhost:5173
- [ ] Login works in frontend (calls Spring Boot backend)
- [ ] Two separate GitHub repos created
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Live frontend connects to live backend

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check Java version: `java -version` (must be 21)
- Check Maven: `mvn -version`
- Check MySQL running: `mysql -u root -p`
- Check logs in terminal

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` in `.env`
- Check if backend is running
- Check browser console for CORS errors
- Verify Authorization header is being sent

**Deployment fails?**
- Backend: Ensure `application.yml` doesn't have localhost URLs
- Frontend: Ensure environment variables are set on Vercel
- Check Railway/Vercel deployment logs

---

## 📚 Additional Resources

- Spring Boot Docs: https://spring.io/projects/spring-boot
- Spring Security: https://spring.io/projects/spring-security
- JWT Guide: https://jwt.io
- Railway Docs: https://railway.app/docs
- Vercel Docs: https://vercel.com/docs

---

## 💡 Pro Tips

1. **Save JWT token locally for testing:**
   ```javascript
   localStorage.setItem('token', 'eyJhbGci...');
   ```

2. **Check token content:**
   ```javascript
   // In browser console
   const token = localStorage.getItem('token');
   console.log(atob(token.split('.')[1]));
   ```

3. **Change default port if 8080 is taken:**
   ```yaml
   server:
     port: 8081
   ```

---

## 📞 Next Meeting Topics

1. ✅ Database schema ported to MySQL
2. ✅ All APIs working in Spring Boot
3. ⬜ Add file upload for resumes
4. ⬜ Add Google GenAI for recommendations
5. ⬜ Performance testing
6. ⬜ Security hardening

**You're on the right track! 🎉**
