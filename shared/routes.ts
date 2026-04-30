import { z } from "zod";
import { insertUserSchema, insertStudentSchema, insertEmployerSchema, insertJobSchema, insertApplicationSchema, users, students, employers, jobs, applications, type User, type Student, type Employer, type Job, type Application, type InsertUser, type InsertStudent, type InsertEmployer, type InsertJob, type InsertApplication, applicationStatuses, type ApplicationStatus, userRoles, type UserRole } from "./schema";

// Re-export types
export type { User, Student, Employer, Job, Application, InsertUser, InsertStudent, InsertEmployer, InsertJob, InsertApplication, ApplicationStatus, UserRole };
export { applicationStatuses, userRoles };

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/auth/register",
      input: insertUserSchema.extend({
        studentDetails: insertStudentSchema.omit({ userId: true }).optional(),
        employerDetails: insertEmployerSchema.omit({ userId: true }).optional(),
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/auth/login",
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout",
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/auth/me",
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  users: {
    profile: {
      method: "GET" as const,
      path: "/api/profile",
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          student: z.custom<typeof students.$inferSelect>().nullable(),
          employer: z.custom<typeof employers.$inferSelect>().nullable(),
        }),
      },
    },
    updateProfile: {
      method: "PATCH" as const,
      path: "/api/profile",
      input: z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        student: z.object({
          department: z.string().nullable().optional(),
          cgpa: z.string().nullable().optional(),
          graduationYear: z.number().nullable().optional(),
          skills: z.string().nullable().optional(),
          education: z.string().nullable().optional(),
          projects: z.string().nullable().optional(),
          resumeUrl: z.string().nullable().optional(),
        }).optional(),
        employer: z.object({
          companyName: z.string().min(1).optional(),
          industry: z.string().nullable().optional(),
          website: z.string().nullable().optional(),
        }).optional(),
      }),
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          student: z.custom<typeof students.$inferSelect>().nullable(),
          employer: z.custom<typeof employers.$inferSelect>().nullable(),
        }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/users", // Admin only
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    approveEmployer: {
      method: "PATCH" as const,
      path: "/api/employers/:id/approve",
      responses: {
        200: z.custom<typeof employers.$inferSelect>(),
      },
    },
  },
  notifications: {
    list: {
      method: "GET" as const,
      path: "/api/notifications",
      responses: {
        200: z.array(z.object({
          id: z.string(),
          title: z.string(),
          body: z.string(),
          audience: z.string(),
          createdAt: z.string(),
        })),
      },
    },
  },
  recruiters: {
    list: {
      method: "GET" as const,
      path: "/api/recruiters",
      responses: {
        200: z.array(
          z.object({
            userId: z.number(),
            username: z.string(),
            name: z.string(),
            email: z.string(),
            companyName: z.string(),
            industry: z.string().nullable(),
            website: z.string().nullable(),
            isApproved: z.boolean().nullable(),
            activeDrives: z.number(),
            totalApplications: z.number(),
          }),
        ),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/recruiters",
      input: z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        name: z.string().min(1),
        email: z.string().email(),
        companyName: z.string().min(1),
        industry: z.string().optional(),
        website: z.string().optional(),
      }),
      responses: {
        201: z.object({
          id: z.number(),
          username: z.string(),
          role: z.string(),
          name: z.string(),
          email: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    details: {
      method: "GET" as const,
      path: "/api/recruiters/:id",
      responses: {
        200: z.object({
          recruiter: z.object({
            userId: z.number(),
            username: z.string(),
            name: z.string(),
            email: z.string(),
            companyName: z.string(),
            industry: z.string().nullable(),
            website: z.string().nullable(),
            isApproved: z.boolean().nullable(),
            activeDrives: z.number(),
            totalApplications: z.number(),
          }),
          jobs: z.array(z.custom<typeof jobs.$inferSelect>()),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  students: {
    list: {
      method: "GET" as const,
      path: "/api/students",
      responses: {
        200: z.array(
          z.object({
            userId: z.number(),
            username: z.string(),
            name: z.string(),
            email: z.string(),
            department: z.string().nullable(),
            cgpa: z.string().nullable(),
            graduationYear: z.number().nullable(),
            resumeUrl: z.string().nullable(),
            status: z.string(),
            applicationsCount: z.number(),
            selectedCount: z.number(),
          }),
        ),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/students",
      input: z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        name: z.string().min(1),
        email: z.string().email(),
        department: z.string().optional(),
        cgpa: z.string().optional(),
        graduationYear: z.number().optional(),
        resumeUrl: z.string().optional(),
      }),
      responses: {
        201: z.object({
          id: z.number(),
          username: z.string(),
          role: z.string(),
          name: z.string(),
          email: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    details: {
      method: "GET" as const,
      path: "/api/students/:id",
      responses: {
        200: z.object({
          student: z.object({
            userId: z.number(),
            username: z.string(),
            name: z.string(),
            email: z.string(),
            department: z.string().nullable(),
            cgpa: z.string().nullable(),
            graduationYear: z.number().nullable(),
            resumeUrl: z.string().nullable(),
            status: z.string(),
            applicationsCount: z.number(),
            selectedCount: z.number(),
          }),
          applications: z.array(z.custom<typeof applications.$inferSelect>()),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  jobs: {
    list: {
      method: "GET" as const,
      path: "/api/jobs",
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect & { employer: typeof users.$inferSelect }>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/jobs",
      input: insertJobSchema.omit({ employerId: true }),
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/jobs/:id",
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },

    getRecommendations: {
      method: "GET" as const,
      path: "/api/jobs/recommendations",
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect & { employer?: typeof users.$inferSelect; matchScore?: number }>()),
      },
    },
  },
applications: {
  list: {
    method: "GET" as const,
    path: "/api/applications",
    responses: {
      200: z.array(
        z.custom<
          typeof applications.$inferSelect & {
            job: typeof jobs.$inferSelect;
            student: typeof users.$inferSelect;
          }
        >()
      ),
    },
  },

  create: {
    method: "POST" as const,
    path: "/api/applications",
    input: z.object({ jobId: z.number() }),
    responses: {
      201: z.custom<typeof applications.$inferSelect>(),
    },
  },

  updateStatus: {
    method: "PATCH" as const,
    path: "/api/applications/:id/status",
    input: z.object({
      status: z.enum(applicationStatuses),
      currentRound: z.string().optional(),
      remarks: z.string().optional(),
    }),
    responses: {
      200: z.custom<typeof applications.$inferSelect>(),
      400: errorSchemas.validation,
      404: errorSchemas.notFound,
    },
  },
},
  
  interviews: {
    createSlot: {
      method: "POST" as const,
      path: "/api/jobs/:id/slots",
      input: z.object({
        startTime: z.string(),
        endTime: z.string(),
        roundType: z.string(),
      }),
      responses: {
        201: z.custom<any>(),
      },
    },
    listSlots: {
      method: "GET" as const,
      path: "/api/jobs/:id/slots",
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    bookSlot: {
      method: "POST" as const,
      path: "/api/slots/:id/book",
      input: z.object({
        applicationId: z.number(),
      }),
      responses: {
        200: z.custom<any>(),
      },
    },
    mySchedule: {
      method: "GET" as const,
      path: "/api/interviews/schedule",
      responses: {
        200: z.array(z.any()),
      },
    },
  },

stats: {
    get: {
      method: "GET" as const,
      path: "/api/stats", // Admin/Officer
      responses: {
        200: z.object({
          totalStudents: z.number(),
          totalEmployers: z.number(),
          totalJobs: z.number(),
          placements: z.number(),
        }),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
export const buildUrlHelper = buildUrl;
