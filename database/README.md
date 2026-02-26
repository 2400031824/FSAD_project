<!-- ============================================================================
PLACEMENT MANAGEMENT SYSTEM - SCHEMA DOCUMENTATION
============================================================================ -->

# 🎓 Placement Management System - Database Schema

Complete production-ready Supabase schema for managing university placement lifecycle including student applications, job drives, interviews, offers, and analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Database Tables](#database-tables)
- [ENUM Types](#enum-types)
- [Security & RLS Policies](#security--rls-policies)
- [Triggers & Automations](#triggers--automations)
- [Analytics Views](#analytics-views)
- [Storage Buckets](#storage-buckets)
- [API Integration](#api-integration)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This schema implements a complete placement management platform supporting:

- **4 User Roles**: Admin, Placement Officer, Student, Recruiter
- **Full Application Lifecycle**: Apply → Shortlist → Interview → Offer → Accept
- **Multi-Round Interviews**: Aptitude, Technical, HR, GD, Coding
- **Real-time Notifications**: Alert, Info, Success types
- **Analytics Dashboard**: Placement rates, company stats, conversion funnel
- **Role-Based Access**: Student can only see their data, Recruiter own drives, etc.
- **Secure File Storage**: Resumes, offer letters, company logos with RLS

---

## 🏗 Architecture

### Key Design Principles

1. **Normalization**: 3NF compliant with proper references
2. **Scalability**: Indexed on all frequently-queried columns
3. **Security**: RLS policies on every table, soft deletes where needed
4. **Auditability**: `created_at`, `updated_at` on all tables
5. **Constraints**: Foreign keys, UNIQUEs, CHECKs for data integrity
6. **Automation**: Triggers for status updates and notifications

### Data Model Diagram

```
profiles (extends auth.users)
├── students
├── recruiters
└── admins/placement_officers

job_drives (recruiter_id → profiles)
├── applications (student_id, job_drive_id)
│   ├── interview_results
│   └── offers
└── interview_rounds
    └── interview_results

notifications (user_id → profiles)
```

---

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project with PostgreSQL
3. Note your `PROJECT_URL` and `ANON_KEY`

### Step 2: Execute Schema SQL

1. Go to Supabase Dashboard → SQL Editor
2. Open `database/schema.sql`
3. Copy entire content and paste in SQL Editor
4. Click "Run" or press `Ctrl+Enter`
5. Wait for all tables, indexes, and triggers to be created

**Expected Result:** 
- ✅ 9 tables created
- ✅ 8 ENUM types created
- ✅ 40+ indexes created
- ✅ 20+ RLS policies enabled
- ✅ 7 triggers created
- ✅ 4 analytics views created

### Step 3: Create Storage Buckets

1. Go to Supabase Dashboard → Storage
2. Create 5 buckets:
   - `resumes` (Private)
   - `company_logos` (Public)
   - `offer_letters` (Private)
   - `profile_pictures` (Public)
   - `interview_documents` (Private)

3. For each bucket, go to Policies tab
4. Copy policies from `database/storage-setup.sql`
5. Enable RLS toggle for each bucket

### Step 4: Load Sample Data (Optional)

1. Go to SQL Editor
2. Execute `database/seed.sql`
3. Replace `gen_random_uuid()` with actual auth user IDs from Supabase Auth

### Step 5: Enable Authentication

1. Go to Supabase Dashboard → Authentication
2. Create auth users for each role:
   - 1 Admin user
   - 1 Placement Officer
   - 3-5 Student users
   - 2-3 Recruiter users

3. Note their UUIDs for seed data

---

## 📊 Database Tables

### 1️⃣ `profiles` - User Base

Extends Supabase `auth.users` with additional profile fields.

```sql
-- Fields
id (UUID, PK) - References auth.users
full_name (VARCHAR 255) - User's full name
email (VARCHAR 255, UNIQUE) - Email address
phone (VARCHAR 20) - Contact number
role (user_role ENUM) - ADMIN, PLACEMENT_OFFICER, STUDENT, RECRUITER
profile_picture_url (TEXT) - URL to profile image
is_active (BOOLEAN) - Account active/inactive
created_at, updated_at (TIMESTAMP)

-- Constraints
- Email validation regex
- Phone format validation
- NOT NULL on required fields
```

**Relationships:**
- ← students (1:1)
- ← recruiters (1:1)
- ← job_drives.created_by (1:N)
- ← notifications (1:N)
- ← interview_results.evaluated_by (1:N)

---

### 2️⃣ `students` - Student Records

Student-specific data including placement tracking.

```sql
-- Fields
id (UUID, PK, FK→profiles) - Foreign key to profile
roll_number (VARCHAR 50, UNIQUE) - Student ID
branch (VARCHAR 100) - Department (CSE, ECE, etc.)
batch_year (INTEGER) - Graduation year
cgpa (NUMERIC 3,2) - Cumulative GPA (0-10)
backlogs (INTEGER) - Number of failed courses
skills (TEXT[]) - Array of tech skills
resume_url (TEXT) - URL to resume in storage
linkedin_url, github_url, portfolio_url (TEXT) - Social profiles
is_eligible (BOOLEAN) - Eligible for placement
placement_status (placement_status ENUM) - NOT_PLACED, PLACED, BLACKLISTED
created_at, updated_at (TIMESTAMP)

-- Constraints
- CGPA: 0-10 range
- Backlogs: >= 0
- Batch year: 2010-2100
- Unique roll number
```

**Key Features:**
- Track placement status across all job drives
- Monitor eligibility based on CGPA, backlogs
- Skills array for quick matching with job requirements
- Central record for all student placements

---

### 3️⃣ `recruiters` - Company Records

Recruiter/company information and verification status.

```sql
-- Fields
id (UUID, PK, FK→profiles) - Foreign key to profile
company_name (VARCHAR 255) - Official company name
company_description (TEXT) - Company details
company_website (TEXT) - URL validation required
company_logo_url (TEXT) - Logo in storage
industry (VARCHAR 100) - Tech, Finance, Consulting, etc.
hr_contact_name (VARCHAR 255) - HR contact person
hr_contact_email (VARCHAR 255) - HR email
hr_contact_phone (VARCHAR 20) - HR phone
is_verified (BOOLEAN) - Admin verification required
created_at, updated_at (TIMESTAMP)

-- Constraints
- Website URL validation
- Unique company per recruiter
```

**Key Features:**
- Verification workflow for recruiter registration
- Only verified recruiters can post drives and see student resumes
- Contact details for coordination

---

### 4️⃣ `job_drives` - Job Postings

Job posting and drive configuration.

```sql
-- Fields
id (UUID, PK) - Primary key
recruiter_id (UUID, FK→recruiters) - Posting company
title (VARCHAR 255) - Job title
description (TEXT) - Job description
job_type (job_type ENUM) - INTERN, FTE, PPO
location (VARCHAR 255) - Job location
salary_package (NUMERIC 10,2) - Monthly/annual salary
eligibility_criteria (TEXT) - Eligibility text
minimum_cgpa (NUMERIC 3,2) - Minimum CGPA for eligibility
allowed_branches (TEXT[]) - Eligible branches array
allowed_batches (INTEGER[]) - Eligible batch years array
registration_deadline (TIMESTAMP) - Application deadline
drive_date (TIMESTAMP) - Drive/interview date
status (job_drive_status ENUM) - DRAFT, OPEN, CLOSED, COMPLETED
created_by (UUID, FK→profiles) - Placement officer who created
created_at, updated_at (TIMESTAMP)

-- Constraints
- registration_deadline < drive_date
- salary_package > 0
- drive_date > now() (prevents backdating)
```

**Key Features:**
- Auto-filtering based on CGPA, branch, batch
- Status workflow tracking
- Multiple job types support

---

### 5️⃣ `applications` - Job Applications

Student applications to job drives with unique constraint.

```sql
-- Fields
id (UUID, PK) - Primary key
student_id (UUID, FK→students) - Applying student
job_drive_id (UUID, FK→job_drives) - Target job drive
current_status (application_status ENUM) - APPLIED, SHORTLISTED, REJECTED, etc.
applied_at (TIMESTAMP) - Application submit time
updated_at (TIMESTAMP) - Last status change

-- Constraints
- UNIQUE(student_id, job_drive_id) - One application per drive
- applied_at <= now() - No future dates
```

**Statuses:** APPLIED → SHORTLISTED → INTERVIEW → OFFERED → ACCEPTED/DECLINED

---

### 6️⃣ `interview_rounds` - Interview Definitions

Define interview rounds for each job drive.

```sql
-- Fields
id (UUID, PK) - Primary key
job_drive_id (UUID, FK→job_drives) - Associated drive
round_name (VARCHAR 255) - "Coding Round 1", "HR Interview", etc.
round_type (interview_round_type ENUM) - APTITUDE, TECHNICAL, HR, GD, CODING
round_order (INTEGER) - Sequence (1, 2, 3, ...)
scheduled_date (TIMESTAMP) - When round happens
created_at (TIMESTAMP)

-- Constraints
- UNIQUE(job_drive_id, round_order)
- round_order > 0
```

---

### 7️⃣ `interview_results` - Interview Outcomes

Results of interview rounds per application.

```sql
-- Fields
id (UUID, PK) - Primary key
application_id (UUID, FK→applications) - Which application
round_id (UUID, FK→interview_rounds) - Which round
status (interview_result_status ENUM) - PASS, FAIL, PENDING
feedback (TEXT) - Evaluator comments
evaluated_by (UUID, FK→profiles) - Who evaluated
evaluated_at (TIMESTAMP) - When evaluated
created_at (TIMESTAMP)

-- Constraints
- UNIQUE(application_id, round_id) - One result per round per application
```

---

### 8️⃣ `offers` - Job Offers

Formal job offers to selected candidates.

```sql
-- Fields
id (UUID, PK) - Primary key
application_id (UUID, FK→applications) - Which application got offer
offered_salary (NUMERIC 10,2) - Offered package
offer_letter_url (TEXT) - URL to PDF in storage
offer_status (offer_status ENUM) - PENDING, ACCEPTED, DECLINED, EXPIRED
issued_at (TIMESTAMP) - Offer date
responded_at (TIMESTAMP) - Student response date
created_at, updated_at (TIMESTAMP)

-- Constraints
- UNIQUE(application_id) - One offer per application
- offered_salary > 0
```

**Automation:** When offer_status = ACCEPTED, updates `students.placement_status` to PLACED

---

### 9️⃣ `notifications` - User Notifications

Real-time notifications for all actions.

```sql
-- Fields
id (UUID, PK) - Primary key
user_id (UUID, FK→profiles) - Recipient
title (VARCHAR 255) - Notification title
message (TEXT) - Notification body
type (notification_type ENUM) - INFO, ALERT, SUCCESS
is_read (BOOLEAN) - Read status
related_entity_id (UUID) - ID of related application/offer/etc
created_at, updated_at (TIMESTAMP)

-- Auto-generated for:
- New applications (→ Placement Officer)
- Shortlisting (→ Student)
- Interview scheduling (→ Student)
- Offer issued (→ Student)
- Offer acceptance (→ Recruiter)
```

---

## 📝 ENUM Types

All ENUM types are immutable and enforce data consistency:

```sql
-- User roles
user_role: 'ADMIN' | 'PLACEMENT_OFFICER' | 'STUDENT' | 'RECRUITER'

-- Job type
job_type: 'INTERN' | 'FTE' | 'PPO'

-- Job drive status
job_drive_status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED'

-- Placement status
placement_status: 'NOT_PLACED' | 'PLACED' | 'BLACKLISTED'

-- Application status (7-stage funnel)
application_status: 'APPLIED' | 'SHORTLISTED' | 'REJECTED' | 
                    'INTERVIEW' | 'OFFERED' | 'ACCEPTED' | 'DECLINED'

-- Interview round type
interview_round_type: 'APTITUDE' | 'TECHNICAL' | 'HR' | 'GD' | 'CODING'

-- Interview result status
interview_result_status: 'PASS' | 'FAIL' | 'PENDING'

-- Offer status
offer_status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'

-- Notification type
notification_type: 'INFO' | 'ALERT' | 'SUCCESS'
```

---

## 🔐 Security & RLS Policies

**Row Level Security (RLS)** is enabled on ALL tables. Policies enforce:

### Student Access
```
✅ CAN: See own profile, applications, offers, notifications
✅ CAN: Upload resume, apply to open drives
✅ CAN: See own interview results and offers
✅ CAN: Accept/decline offers
❌ CANNOT: See other students' data
❌ CANNOT: Modify placement_status directly
❌ CANNOT: See unverified recruiters
```

### Recruiter Access
```
✅ CAN: See own profile, company info, own job drives
✅ CAN: Create and manage drives
✅ CAN: View applications/shortlisting/interviews for own drives
✅ CAN: See student resumes for their shortlisted candidates
✅ CAN: Create interview rounds and results
✅ CAN: Create and send offer letters
❌ CANNOT: See other recruiters' drives
❌ CANNOT: See students who didn't apply
❌ CANNOT: Change placement_status
```

### Placement Officer Access
```
✅ CAN: See all students, all drives, all applications
✅ CAN: Create and manage job drives
✅ CAN: Verify recruiters
✅ CAN: View all resumes
✅ CAN: See analytics and reports
✅ CAN: Create and manage interview rounds
```

### Admin Access
```
✅ CAN: Full access to all tables
✅ CAN: Create users with any role
✅ CAN: Archive/delete data
✅ CAN: View all analytics
✅ CAN: Manage system settings
```

### Policy Implementation Pattern

All policies follow this pattern:

```sql
-- SELECT: Can user see this data?
CREATE POLICY "table_select" ON table_name
  FOR SELECT USING (user_satisfies_condition);

-- INSERT: Can user create new records?
CREATE POLICY "table_insert" ON table_name
  FOR INSERT WITH CHECK (user_satisfies_condition);

-- UPDATE: Can user modify existing records?
CREATE POLICY "table_update" ON table_name
  FOR UPDATE USING (user_satisfies_condition)
  WITH CHECK (user_satisfies_condition);

-- DELETE: Can user remove records?
CREATE POLICY "table_delete" ON table_name
  FOR DELETE USING (user_satisfies_condition);
```

---

## ⚡ Triggers & Automations

### 1. Automatic Placement Status Update

```
When: Offer status changes to ACCEPTED
Then: Update student placement_status = PLACED
Why: Keeps placement status in sync with offers
```

### 2. Application Notification

```
When: New application created
Then: Create notification for placement officer
Why: Alert officer about new applications immediately
```

### 3. Auto-Update Timestamp

```
When: Any table row updated
Then: Set updated_at = now()
Why: Track all changes for auditing
Applied to: profiles, students, recruiters, job_drives, applications, offers, notifications
```

### Example Trigger Code

```sql
CREATE TRIGGER trigger_placement_status_on_offer
AFTER UPDATE OF offer_status ON offers
FOR EACH ROW
EXECUTE FUNCTION set_placement_status_on_offer_accepted();

CREATE TRIGGER trigger_notification_on_application
AFTER INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION create_notification_on_application();
```

---

## 📈 Analytics Views

### 1. `placement_rate_by_batch`

```sql
SELECT batch_year, total_students, placed_students, placement_rate_percent
FROM placement_rate_by_batch;
```

Shows placement success percentage for each graduation year.

### 2. `placement_rate_by_branch`

Shows placement success percentage by department.

### 3. `company_hiring_stats`

```sql
SELECT company_name, industry, total_drives, total_applications, 
       total_selected, total_offers_accepted, avg_salary_offered
FROM company_hiring_stats;
```

Summary of each company's recruitment activity.

### 4. `application_conversion_funnel`

Shows how many applications at each stage:
- Applied
- Shortlisted
- Interview
- Offered
- Accepted

### 5. `drive_performance_metrics`

Performance metrics per job drive:
- Total applications
- Shortlist rate
- Interview rate
- Offer rate
- Conversion rate

---

## 💾 Storage Buckets

### Bucket Structure

```
supabase-storage/
├── resumes/
│   └── {student_id}/
│       ├── resume.pdf
│       └── resume_v2.pdf
│
├── company_logos/
│   └── {recruiter_id}/
│       └── logo.png
│
├── offer_letters/
│   └── {application_id}/
│       └── offer_letter.pdf
│
├── profile_pictures/
│   └── {user_id}/
│       └── profile.jpg
│
└── interview_documents/
    └── {round_id}/
        ├── test_paper.pdf
        └── evaluation_form.pdf
```

### File Size Limits

| Bucket | 📦 Size Limit | 📄 Types | 🔒 Access |
|--------|--------------|---------|-----------|
| resumes | 10 MB | PDF, DOC, DOCX | Private |
| company_logos | 5 MB | PNG, JPG, WebP | Public |
| offer_letters | 10 MB | PDF | Private |
| profile_pictures | 3 MB | PNG, JPG, WebP | Public |
| interview_documents | 50 MB | PDF, TXT, JPG, PNG | Private |

### Access Control Example

```typescript
// Student uploads resume
const { data, error } = await supabase
  .storage
  .from('resumes')
  .upload(`${studentId}/resume.pdf`, file);

// Recruiter downloads shortlisted student's resume
const { data } = await supabase
  .storage
  .from('resumes')
  .download(`${studentId}/resume.pdf`);
// Only allowed if student applied to recruiter's drive and is shortlisted
```

---

## 🔌 API Integration

### Setup Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)
```

### Example Queries

#### Get Student's Applications

```typescript
const { data, error } = await supabase
  .from('applications')
  .select(`
    id, current_status, applied_at,
    job_drives(title, salary_package, company:recruiters(company_name))
  `)
  .eq('student_id', studentId)
  .order('applied_at', { ascending: false })
```

#### Get Job Drive with Analytics

```typescript
const { data } = await supabase
  .from('drive_performance_metrics')
  .select('*')
  .eq('id', driveId)
  .single()

// Returns: applications, shortlisted, interviews, offers, conversion_rate
```

#### Create Application

```typescript
const { data, error } = await supabase
  .from('applications')
  .insert([
    {
      student_id: studentId,
      job_drive_id: driveId,
      current_status: 'APPLIED'
    }
  ])
  .select()
```

#### Real-time Notifications

```typescript
const subscription = supabase
  .from('notifications')
  .on('INSERT', payload => {
    console.log('New notification:', payload.new)
  })
  .subscribe()
```

---

## ⚙️ Performance Optimization

### Index Strategy

All frequently-queried columns are indexed:

```sql
-- Student query optimization
CREATE INDEX idx_students_placement_status ON students(placement_status);
CREATE INDEX idx_students_branch ON students(branch);
CREATE INDEX idx_students_batch_year ON students(batch_year);

-- Application query optimization
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_job_drive_id ON applications(job_drive_id);
CREATE INDEX idx_applications_status ON applications(current_status);

-- Notification query optimization
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

### Query Recommendations

⚠️ **Avoid:**
```sql
SELECT * FROM students WHERE skills LIKE '%Python%'; -- Slow on array
SELECT * FROM job_drives WHERE description ILIKE '%engineer%'; -- Full text
```

✅ **Prefer:**
```sql
SELECT * FROM students WHERE skills @> ARRAY['Python']; -- Array containment
SELECT * FROM job_drives WHERE status = 'OPEN'; -- Use indexes
```

### Connection Pooling

Set `pgbouncer_mode: transaction` in connection string for better performance with multiple concurrent connections.

---

## 🛠 Troubleshooting

### Issue: "new row violates row-level security policy"

**Cause:** User doesn't have permission per RLS policy

**Solution:**
1. Check user's role: `SELECT role FROM profiles WHERE id = auth.uid()`
2. Verify RLS policy includes user's role/condition
3. Test with auth user that has correct role

### Issue: "Unique constraint violation"

**Cause:** Duplicate unique value

**Solutions:**
- `applications(student_id, job_drive_id)`: Student already applied to drive
- `students(roll_number)`: Roll number already exists
- `offers(application_id)`: Offer already created for application

### Issue: "Foreign key constraint violation"

**Cause:** Referenced record doesn't exist

**Solution:** Ensure parent record exists before inserting child
```sql
-- ❌ Bad: student_id might not exist
INSERT INTO applications(student_id, job_drive_id) 
VALUES(uuid, uuid);

-- ✅ Good: verify first
SELECT 1 FROM students WHERE id = student_id;
```

### Issue: Notification not created on application insert

**Cause:** No placement officer exists or trigger failed

**Solution:**
```sql
-- Check placement officer exists
SELECT COUNT(*) FROM profiles WHERE role = 'PLACEMENT_OFFICER';

-- Check trigger function
SELECT definition FROM pg_proc WHERE proname = 'create_notification_on_application';

-- Manually create notification
INSERT INTO notifications(user_id, title, message, type) 
VALUES(officer_id, 'title', 'message', 'ALERT');
```

### Performance: Slow analytics queries

**Solution:** Refresh materialized views periodically
```sql
-- Convert views to materialized views
CREATE MATERIALIZED VIEW placement_rate_by_batch AS ...;

-- Refresh on schedule
REFRESH MATERIALIZED VIEW placement_rate_by_batch;
```

---

## 📚 Additional Resources

### Supabase Docs
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Realtime](https://supabase.com/docs/guides/realtime)

### PostgreSQL Advanced
- [Full Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [JSON Operations](https://www.postgresql.org/docs/current/functions-json.html)
- [Array Functions](https://www.postgresql.org/docs/current/functions-array.html)

---

## 📄 License & Usage

This schema is provided as-is for educational and commercial use. Modify as needed for your institution's requirements.

### Customization Ideas

1. **Add resume parsing** to extract skills from uploaded PDFs
2. **Integrate email notifications** with SendGrid/Postmark
3. **Add interview scheduling** with Google Calendar API
4. **Implement AI resume screening** with ML models
5. **Create analytics dashboard** with Metabase/Superset
6. **Add document signing** for offer letters with DocuSign

---

**Last Updated:** February 2026
**Version:** 1.0
**Status:** Production Ready ✅
