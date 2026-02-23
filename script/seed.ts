import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../shared/schema";
import { hash } from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    const sql = postgres(databaseUrl);
    const db = drizzle(sql, { schema });

    console.log("📊 Creating tables if they don't exist...");

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'employer', 'admin', 'officer')),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at BIGINT
      );

      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        department TEXT,
        cgpa TEXT,
        graduation_year INTEGER,
        resume_url TEXT
      );

      CREATE TABLE IF NOT EXISTS employers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name TEXT NOT NULL,
        industry TEXT,
        website TEXT,
        is_approved BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        location TEXT NOT NULL,
        salary TEXT NOT NULL,
        posted_at BIGINT
      );

      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Selected', 'Rejected')),
        current_round TEXT,
        remarks TEXT,
        applied_at BIGINT,
        updated_at BIGINT
      );
    `;

    console.log("✅ Tables created successfully");

    // Check if seed data already exists
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users;`;
    if (existingUsers[0].count > 0) {
      console.log("⏭️  Seed data already exists, skipping...");
      await sql.end();
      return;
    }

    console.log("👤 Inserting seed users...");

    const now = Date.now();

    // Hash passwords
    const adminPassword = await hash("admin123", 10);
    const studentPassword = await hash("student123", 10);
    const employerPassword = await hash("employer123", 10);
    const officerPassword = await hash("officer123", 10);

    // Insert admin
    const adminResult = await sql`
      INSERT INTO users (username, password, role, name, email, created_at)
      VALUES ('admin', $1, 'admin', 'Admin User', 'admin@fsad.com', $2)
      RETURNING id;
    `([adminPassword, now]);
    const adminId = adminResult[0].id;

    // Insert officer
    const officerResult = await sql`
      INSERT INTO users (username, password, role, name, email, created_at)
      VALUES ('officer', $1, 'officer', 'Placement Officer', 'officer@fsad.com', $2)
      RETURNING id;
    `([officerPassword, now]);

    // Insert students
    const student1Result = await sql`
      INSERT INTO users (username, password, role, name, email, created_at)
      VALUES ('student1', $1, 'student', 'Raj Kumar', 'raj@student.com', $2)
      RETURNING id;
    `([studentPassword, now]);
    const student1Id = student1Result[0].id;

    const student2Result = await sql`
      INSERT INTO users (username, password, role, name, email, created_at)
      VALUES ('student2', $1, 'student', 'Priya Singh', 'priya@student.com', $2)
      RETURNING id;
    `([studentPassword, now]);
    const student2Id = student2Result[0].id;

    const student3Result = await sql`
      INSERT INTO users (username, password, role, name, email, created_at)
      VALUES ('student3', $1, 'student', 'Arjun Patel', 'arjun@student.com', $2)
      RETURNING id;
    `([studentPassword, now]);
    const student3Id = student3Result[0].id;

    // Insert employers
    const employer1Result = await sql`
      INSERT INTO users (username, password, role, name, email, created_at)
      VALUES ('google', $1, 'employer', 'Google India', 'jobs@google.com', $2)
      RETURNING id;
    `([employerPassword, now]);
    const employer1Id = employer1Result[0].id;

    const employer2Result = await sql`
      INSERT INTO users (username, password, role, name, email, created_at)
      VALUES ('microsoft', $1, 'employer', 'Microsoft India', 'careers@microsoft.com', $2)
      RETURNING id;
    `([employerPassword, now]);
    const employer2Id = employer2Result[0].id;

    console.log("👥 Creating student profiles...");

    // Create student profiles
    await sql`
      INSERT INTO students (user_id, department, cgpa, graduation_year, resume_url)
      VALUES
        ($1, 'Computer Science', '8.5', 2024, '/resumes/raj.pdf'),
        ($2, 'Electronics', '8.2', 2024, '/resumes/priya.pdf'),
        ($3, 'Information Technology', '8.8', 2024, '/resumes/arjun.pdf');
    `([student1Id, student2Id, student3Id]);

    console.log("🏢 Creating employer profiles...");

    // Create employer profiles
    await sql`
      INSERT INTO employers (user_id, company_name, industry, website, is_approved)
      VALUES
        ($1, 'Google India', 'Technology', 'https://google.com', true),
        ($2, 'Microsoft India', 'Technology', 'https://microsoft.com', true);
    `([employer1Id, employer2Id]);

    console.log("💼 Creating job postings...");

    // Create job postings
    const job1Result = await sql`
      INSERT INTO jobs (employer_id, title, description, requirements, location, salary, posted_at)
      VALUES (
        $1,
        'Software Engineer - Full Stack',
        'We are looking for experienced full-stack developers to join our team and build amazing applications.',
        'Node.js, React, PostgreSQL, Docker, AWS',
        'Bangalore, India',
        '12-15 LPA',
        $2
      )
      RETURNING id;
    `([employer1Id, now]);
    const job1Id = job1Result[0].id;

    const job2Result = await sql`
      INSERT INTO jobs (employer_id, title, description, requirements, location, salary, posted_at)
      VALUES (
        $1,
        'Software Engineer - Web Development',
        'Join our web development team to create cutting-edge web applications.',
        '.NET, Angular, SQL Server, Azure',
        'Pune, India',
        '13-16 LPA',
        $2
      )
      RETURNING id;
    `([employer2Id, now]);
    const job2Id = job2Result[0].id;

    const job3Result = await sql`
      INSERT INTO jobs (employer_id, title, description, requirements, location, salary, posted_at)
      VALUES (
        $1,
        'Data Engineer',
        'Build scalable data pipelines and work with big data technologies.',
        'Python, Spark, Hadoop, SQL, AWS',
        'Bangalore, India',
        '14-17 LPA',
        $2
      )
      RETURNING id;
    `([employer1Id, now]);
    const job3Id = job3Result[0].id;

    console.log("📝 Creating applications...");

    // Create applications
    await sql`
      INSERT INTO applications (job_id, student_id, status, current_round, remarks, applied_at, updated_at)
      VALUES
        ($1, $2, 'Applied', NULL, 'Initial application received', $6, $6),
        ($1, $3, 'Shortlisted', 'Round 1', 'Selected for technical interview', $6, $6),
        ($2, $2, 'Selected', 'Round 3', 'Offer extended', $6, $6),
        ($3, $4, 'Applied', NULL, 'Application under review', $6, $6),
        ($2, $4, 'Rejected', 'Round 2', 'Not selected after interview', $6, $6);
    `([job1Id, student1Id, student2Id, student3Id, job2Id, now]);

    console.log("✨ Database seeding completed successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("─────────────────────────────────");
    console.log("Admin:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    console.log("\nOfficer:");
    console.log("  Username: officer");
    console.log("  Password: officer123");
    console.log("\nStudent (3 accounts available):");
    console.log("  Username: student1 / student2 / student3");
    console.log("  Password: student123");
    console.log("\nEmployer (2 accounts available):");
    console.log("  Username: google / microsoft");
    console.log("  Password: employer123");
    console.log("─────────────────────────────────\n");

    await sql.end();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
