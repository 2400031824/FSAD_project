import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// =========================
// Enums
// =========================

export const userRoles = ["admin", "student", "employer", "officer"] as const;
export type UserRole = (typeof userRoles)[number];

export const applicationStatuses = [
  "Applied",
  "Screening",
  "Aptitude",
  "Technical",
  "HR",
  "Offer_Released",
  "Offer_Accepted",
  "Joined",
  "Withdrawn",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

// =========================
// Password Validation
// =========================

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// =========================
// Users Table
// =========================

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// =========================
// Students Table
// =========================

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  department: text("department"),
  cgpa: text("cgpa"),
  graduationYear: integer("graduation_year"),
  resumeUrl: text("resume_url"),
  skills: text("skills"),
  education: text("education"),
  projects: text("projects"),
});

// =========================
// Employers Table
// =========================

export const employers = sqliteTable("employers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  companyName: text("company_name").notNull(),
  industry: text("industry"),
  website: text("website"),
  isApproved: integer("is_approved", { mode: "boolean" }).default(false),
});

// =========================
// Jobs Table
// =========================

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employerId: integer("employer_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  location: text("location").notNull(),
  salary: text("salary").notNull(),
  postedAt: integer("posted_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// =========================
// Applications Table (UPGRADED WORKFLOW)
// =========================

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  jobId: integer("job_id")
    .references(() => jobs.id)
    .notNull(),

  studentId: integer("student_id")
    .references(() => users.id)
    .notNull(),

  status: text("status")
    .default("Applied")
    .notNull(),

  currentRound: text("current_round"),

  remarks: text("remarks"),

  appliedAt: integer("applied_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),

  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// =========================
// Interview Slots Table
// =========================

export const interviewSlots = sqliteTable("interview_slots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  jobId: integer("job_id")
    .references(() => jobs.id)
    .notNull(),
    
  employerId: integer("employer_id")
    .references(() => users.id)
    .notNull(),
    
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  
  roundType: text("round_type").notNull(), 
  
  applicationId: integer("application_id")
    .references(() => applications.id),
    
  studentId: integer("student_id")
    .references(() => users.id),
    
  status: text("status")
    .default("open")
    .notNull(), 
    
  meetingLink: text("meeting_link"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// =========================
// Relations
// =========================

export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  employer: one(employers, {
    fields: [users.id],
    references: [employers.userId],
  }),
  jobs: many(jobs),
  applications: many(applications),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  employer: one(users, {
    fields: [jobs.employerId],
    references: [users.id],
  }),
  applications: many(applications),
  interviewSlots: many(interviewSlots),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  student: one(users, {
    fields: [applications.studentId],
    references: [users.id],
  }),
  interviewSlots: many(interviewSlots),
}));

export const interviewSlotsRelations = relations(interviewSlots, ({ one }) => ({
  job: one(jobs, {
    fields: [interviewSlots.jobId],
    references: [jobs.id],
  }),
  employer: one(users, {
    fields: [interviewSlots.employerId],
    references: [users.id],
  }),
  application: one(applications, {
    fields: [interviewSlots.applicationId],
    references: [applications.id],
  }),
  student: one(users, {
    fields: [interviewSlots.studentId],
    references: [users.id],
  }),
}));

// =========================
// Zod Insert Schemas
// =========================

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    password: passwordSchema,
    email: z.string().email("Invalid email address"),
  });

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertEmployerSchema = createInsertSchema(employers).omit({
  id: true,
  isApproved: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
  status: true,
  updatedAt: true,
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(applicationStatuses),
  currentRound: z.string().optional(),
  remarks: z.string().optional(),
});

export const insertInterviewSlotSchema = createInsertSchema(interviewSlots).omit({
  id: true,
  createdAt: true,
  applicationId: true,
  studentId: true,
  status: true,
  meetingLink: true,
});

// =========================
// Types
// =========================

export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Employer = typeof employers.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InterviewSlot = typeof interviewSlots.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertEmployer = z.infer<typeof insertEmployerSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertInterviewSlot = z.infer<typeof insertInterviewSlotSchema>;