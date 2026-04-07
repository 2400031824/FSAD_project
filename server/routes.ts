import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { updateApplicationStatusSchema, applicationStatuses } from "@shared/schema";
import { SESSION_CONFIG, HTTP_STATUS, ERROR_MESSAGES, USER_ROLES, EDIT_APPLICATION_ROLES } from "./constants";
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePassword(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Use env secret when available; fallback keeps demo deployments functional
  const sessionSecret = process.env.SESSION_SECRET || "demo-session-secret-change-me";

  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: SESSION_CONFIG.MAX_AGE, secure: process.env.NODE_ENV === "production" },
      store: new SessionStore({ checkPeriod: SESSION_CONFIG.CHECK_PERIOD }),
    })
  );

  // Authentication Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  // Authorization middleware: Check user role
  const requireRole = (...allowedRoles: string[]) => 
    async (req: any, res: any, next: any) => {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      req.user = user;
      next();
    };

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
      });

      // Create profile based on role
      if (input.role === "student" && input.studentDetails) {
        await storage.createStudent({
          ...input.studentDetails,
          userId: user.id,
        });
      } else if (input.role === "employer" && input.employerDetails) {
        await storage.createEmployer({
          ...input.employerDetails,
          userId: user.id,
        });
      }

      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      console.error("Registration error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    const input = api.auth.login.input.parse(req.body);
    let user = await storage.getUserByUsername(input.username);

    if (!user || !(await comparePassword(input.password, user.password))) {
      const demoPasswords = {
        admin: process.env.DEMO_ADMIN_PASSWORD || "Admin@123",
        techcorp: process.env.DEMO_EMPLOYER_PASSWORD || "Employer@123",
        innovateinc: process.env.DEMO_EMPLOYER_PASSWORD || "Employer@123",
        globalenterprises: process.env.DEMO_EMPLOYER_PASSWORD || "Employer@123",
        alice: process.env.DEMO_STUDENT_PASSWORD || "Student@123",
        bob: process.env.DEMO_STUDENT_PASSWORD || "Student@123",
        carol: process.env.DEMO_STUDENT_PASSWORD || "Student@123",
        david: process.env.DEMO_STUDENT_PASSWORD || "Student@123",
        emma: process.env.DEMO_STUDENT_PASSWORD || "Student@123",
      } as const;

      const demoUserMeta: Record<string, { role: "admin" | "employer" | "student"; name: string; email: string }> = {
        admin: { role: "admin", name: "System Admin", email: "admin@college.edu" },
        techcorp: { role: "employer", name: "Tech Corp HR", email: "hr@techcorp.com" },
        innovateinc: { role: "employer", name: "Innovate Inc HR", email: "hr@innovate.com" },
        globalenterprises: { role: "employer", name: "Global Enterprises HR", email: "hr@globalenterprises.com" },
        alice: { role: "student", name: "Alice Smith", email: "alice@student.edu" },
        bob: { role: "student", name: "Bob Johnson", email: "bob@student.edu" },
        carol: { role: "student", name: "Carol Davis", email: "carol@student.edu" },
        david: { role: "student", name: "David Brown", email: "david@student.edu" },
        emma: { role: "student", name: "Emma Wilson", email: "emma@student.edu" },
      };

      const expectedPassword = demoPasswords[input.username as keyof typeof demoPasswords];
      const demoMeta = demoUserMeta[input.username];

      if (!expectedPassword || !demoMeta || input.password !== expectedPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const hashedPassword = await hashPassword(expectedPassword);
      if (!user) {
        const emailUser = await storage.getUserByEmail(demoMeta.email);
        if (emailUser) {
          user = emailUser;
          await storage.updateUserPassword(user.id, hashedPassword);
        } else {
          user = await storage.createUser({
            username: input.username,
            password: hashedPassword,
            role: demoMeta.role,
            name: demoMeta.name,
            email: demoMeta.email,
          });
        }
      } else {
        await storage.updateUserPassword(user.id, hashedPassword);
        user = await storage.getUser(user.id);
      }

      if (!user) {
        return res.status(500).json({ message: "Failed to initialize demo user" });
      }
    }

    req.session.userId = user.id;
    res.status(200).json(user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Jobs Routes
  app.get(api.jobs.list.path, requireAuth, async (req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.post(api.jobs.create.path, requireAuth, async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (user?.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }
    
    const input = api.jobs.create.input.parse(req.body);
    const job = await storage.createJob({
      ...input,
      employerId: user.id,
    });
    res.status(201).json(job);
  });

  app.get(api.jobs.get.path, requireAuth, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  // Applications Routes
  app.get(api.applications.list.path, requireAuth, async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    try {
      if (user.role === "student") {
        const apps = await storage.getApplicationsByStudent(user.id);
        return res.json(apps);
      } else if (user.role === "employer") {
        // Efficient single query instead of N+1
        const apps = await storage.getApplicationsByEmployer(user.id);
        return res.json(apps);
      } else if (user.role === "admin" || user.role === "officer") {
        const apps = await storage.getAllApplications();
        return res.json(apps);
      }
      res.json([]);
    } catch (err) {
      console.error("Error fetching applications:", err);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post(api.applications.create.path, requireAuth, async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (user?.role !== "student") {
      return res.status(403).json({ message: "Only students can apply" });
    }

    const input = api.applications.create.input.parse(req.body);
    // Check if already applied
    const existingApps = await storage.getApplicationsByStudent(user.id);
    const alreadyApplied = existingApps.find(a => a.job.id === input.jobId);
    if (alreadyApplied) {
        return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await storage.createApplication({
      jobId: input.jobId,
      studentId: user.id,
    });
    res.status(201).json(application);
  });

  app.patch(api.applications.updateStatus.path, requireAuth, async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await storage.getUser(userId);
  if (!user || !["employer", "admin", "officer"].includes(user.role)) {
    return res.status(403).json({ message: "Only employers and admins can update applications" });
  }

  try {
    const input = updateApplicationStatusSchema.parse(req.body);
    const appId = Number(req.params.id);

    const application = await storage.getApplicationById(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Employer ownership check
    if (user.role === "employer") {
      const job = await storage.getJob(application.jobId);
      if (!job || job.employerId !== user.id) {
        return res.status(403).json({ message: "Cannot update applications for this job" });
      }
    }

    const updated = await storage.updateApplication(appId, {
      status: input.status,
      currentRound: input.currentRound ?? null,
      remarks: input.remarks ?? null,
      updatedAt: new Date(),
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: err.errors });
    }
    console.error("Update application error:", err);
    res.status(500).json({ message: "Failed to update application" });
  }
});

  // Stats
  app.get(api.stats.get.path, requireAuth, async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!["admin", "officer"].includes(user?.role || "")) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Auto-seed function with deterministic demo credentials
  const seedDatabase = async () => {
    const adminPassword = process.env.DEMO_ADMIN_PASSWORD || "Admin@123";
    const employerPassword = process.env.DEMO_EMPLOYER_PASSWORD || "Employer@123";
    const studentPassword = process.env.DEMO_STUDENT_PASSWORD || "Student@123";

    const ensureDemoUser = async (options: {
      username: string;
      password: string;
      role: "admin" | "employer" | "student";
      name: string;
      email: string;
      employerDetails?: { companyName: string; industry: string; website: string };
      studentDetails?: { department: string; cgpa: string; graduationYear: number; resumeUrl: string };
    }) => {
      const hashedPassword = await hashPassword(options.password);
      let user = await storage.getUserByUsername(options.username);
      if (!user) {
        user = await storage.getUserByEmail(options.email);
      }

      if (!user) {
        user = await storage.createUser({
          username: options.username,
          password: hashedPassword,
          role: options.role,
          name: options.name,
          email: options.email,
        });
      } else {
        await storage.updateUserPassword(user.id, hashedPassword);
      }

      if (options.employerDetails) {
        const employer = await storage.getEmployer(user.id);
        if (!employer) {
          await storage.createEmployer({
            userId: user.id,
            companyName: options.employerDetails.companyName,
            industry: options.employerDetails.industry,
            website: options.employerDetails.website,
          });
        }
      }

      if (options.studentDetails) {
        const student = await storage.getStudent(user.id);
        if (!student) {
          await storage.createStudent({
            userId: user.id,
            department: options.studentDetails.department,
            cgpa: options.studentDetails.cgpa,
            graduationYear: options.studentDetails.graduationYear,
            resumeUrl: options.studentDetails.resumeUrl,
          });
        }
      }

      return user;
    };

    const admin = await ensureDemoUser({
      username: "admin",
      password: adminPassword,
      role: "admin",
      name: "System Admin",
      email: "admin@college.edu",
    });

    const employers = [
      await ensureDemoUser({
        username: "techcorp",
        password: employerPassword,
        role: "employer",
        name: "Tech Corp HR",
        email: "hr@techcorp.com",
        employerDetails: {
          companyName: "Tech Corp",
          industry: "Software",
          website: "https://techcorp.com",
        },
      }),
      await ensureDemoUser({
        username: "innovateinc",
        password: employerPassword,
        role: "employer",
        name: "Innovate Inc HR",
        email: "hr@innovate.com",
        employerDetails: {
          companyName: "Innovate Inc",
          industry: "AI/ML",
          website: "https://innovate.com",
        },
      }),
      await ensureDemoUser({
        username: "globalenterprises",
        password: employerPassword,
        role: "employer",
        name: "Global Enterprises HR",
        email: "hr@globalenterprises.com",
        employerDetails: {
          companyName: "Global Enterprises",
          industry: "Consulting",
          website: "https://globalenterprises.com",
        },
      }),
    ];

    const students = [
      await ensureDemoUser({
        username: "alice",
        password: studentPassword,
        role: "student",
        name: "Alice Smith",
        email: "alice@student.edu",
        studentDetails: {
          department: "Computer Science",
          cgpa: "3.8",
          graduationYear: 2024,
          resumeUrl: "https://example.com/resume_alice.pdf",
        },
      }),
      await ensureDemoUser({
        username: "bob",
        password: studentPassword,
        role: "student",
        name: "Bob Johnson",
        email: "bob@student.edu",
        studentDetails: {
          department: "Information Technology",
          cgpa: "3.6",
          graduationYear: 2024,
          resumeUrl: "https://example.com/resume_bob.pdf",
        },
      }),
      await ensureDemoUser({
        username: "carol",
        password: studentPassword,
        role: "student",
        name: "Carol Davis",
        email: "carol@student.edu",
        studentDetails: {
          department: "Computer Science",
          cgpa: "3.9",
          graduationYear: 2025,
          resumeUrl: "https://example.com/resume_carol.pdf",
        },
      }),
      await ensureDemoUser({
        username: "david",
        password: studentPassword,
        role: "student",
        name: "David Brown",
        email: "david@student.edu",
        studentDetails: {
          department: "Electronics Engineering",
          cgpa: "3.5",
          graduationYear: 2024,
          resumeUrl: "https://example.com/resume_david.pdf",
        },
      }),
      await ensureDemoUser({
        username: "emma",
        password: studentPassword,
        role: "student",
        name: "Emma Wilson",
        email: "emma@student.edu",
        studentDetails: {
          department: "Data Science",
          cgpa: "3.7",
          graduationYear: 2024,
          resumeUrl: "https://example.com/resume_emma.pdf",
        },
      }),
    ];

    const existingJobs = await storage.getJobs();
    if (existingJobs.length === 0) {
      const job1 = await storage.createJob({
        employerId: employers[0].id,
        title: "Junior React Developer",
        description: "We are looking for a junior developer with React skills to join our fast-growing team. You'll work on innovative products and cutting-edge technologies.",
        requirements: "React, Node.js, TypeScript, CSS/HTML",
        location: "Remote",
        salary: "$60,000 - $70,000"
      });

      const job2 = await storage.createJob({
        employerId: employers[0].id,
        title: "Senior Backend Engineer",
        description: "Looking for an experienced backend engineer to lead our infrastructure team.",
        requirements: "Node.js, PostgreSQL, System Design, Docker",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000"
      });

      const job3 = await storage.createJob({
        employerId: employers[1].id,
        title: "ML Engineer",
        description: "Join our AI/ML team to develop cutting-edge machine learning solutions.",
        requirements: "Python, TensorFlow, PyTorch, AWS",
        location: "Remote",
        salary: "$100,000 - $130,000"
      });

      const job4 = await storage.createJob({
        employerId: employers[1].id,
        title: "Data Scientist",
        description: "Work with large-scale datasets and build predictive models.",
        requirements: "Python, SQL, Pandas, Statistics",
        location: "New York, NY",
        salary: "$90,000 - $120,000"
      });

      await storage.createJob({
        employerId: employers[2].id,
        title: "Management Consultant",
        description: "Help our clients solve complex business problems and drive transformations.",
        requirements: "Problem-solving, Communication, Analytics",
        location: "Various",
        salary: "$80,000 - $100,000"
      });

      await storage.createJob({
        employerId: employers[2].id,
        title: "Full Stack Developer",
        description: "Build end-to-end solutions for our enterprise clients.",
        requirements: "React, Node.js, MongoDB, AWS",
        location: "Chicago, IL",
        salary: "$85,000 - $110,000"
      });

      await storage.createApplication({ jobId: job1.id, studentId: students[0].id });
      await storage.createApplication({ jobId: job1.id, studentId: students[1].id });
      await storage.createApplication({ jobId: job3.id, studentId: students[4].id });
      await storage.createApplication({ jobId: job4.id, studentId: students[4].id });
      await storage.createApplication({ jobId: job2.id, studentId: students[2].id });
    }

    console.log(`Demo users refreshed. Admin ID: ${admin.id}`);
  };
  // Run seed
  seedDatabase().catch(err => console.error("Error seeding database:", err));

  return httpServer;
}

