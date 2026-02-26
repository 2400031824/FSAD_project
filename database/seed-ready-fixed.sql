-- ============================================================================
-- PLACEMENT MANAGEMENT SYSTEM - SEED DATA (Fixed)
-- Only uses actual auth user UUIDs
-- ============================================================================

-- User UUIDs from Supabase Auth
-- Admin: 881675b8-8b51-4697-bf10-22f1478e461a
-- Officer: c965e676-dbde-419f-b891-7f6d8f9486c7
-- Recruiter: b5a9e55c-1d7c-4978-abff-be99d79346de
-- Student: 4f9477b7-5c99-4a9e-999a-c57023528243

-- ============================================================================
-- 1. INSERT SAMPLE PROFILES (Only for real auth users)
-- ============================================================================

INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES
  ('881675b8-8b51-4697-bf10-22f1478e461a', 'Admin User', 'admin@college.edu', '+91-9876543210', 'ADMIN', true),
  ('c965e676-dbde-419f-b891-7f6d8f9486c7', 'Dr. Ramesh Kumar', 'officer@college.edu', '+91-9876543211', 'PLACEMENT_OFFICER', true),
  ('b5a9e55c-1d7c-4978-abff-be99d79346de', 'Priya Sharma', 'recruiter@company.com', '+91-9876543212', 'RECRUITER', true),
  ('4f9477b7-5c99-4a9e-999a-c57023528243', 'Raj Kumar', 'student@college.edu', '+91-9876543213', 'STUDENT', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. INSERT SAMPLE STUDENT DATA
-- ============================================================================

INSERT INTO students (
  id, roll_number, branch, batch_year, cgpa, backlogs, 
  skills, is_eligible, placement_status
)
VALUES (
  '4f9477b7-5c99-4a9e-999a-c57023528243',
  'CSE001',
  'Computer Science',
  2023,
  8.5,
  0,
  ARRAY['Python', 'React', 'Node.js', 'PostgreSQL'],
  true,
  'NOT_PLACED'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. INSERT SAMPLE RECRUITER DATA
-- ============================================================================

INSERT INTO recruiters (
  id, company_name, company_description, company_website,
  industry, hr_contact_name, hr_contact_email, hr_contact_phone,
  is_verified
)
VALUES (
  'b5a9e55c-1d7c-4978-abff-be99d79346de',
  'Google India',
  'Technology giant with focus on search, advertising, and cloud solutions',
  'https://careers.google.com/jobs',
  'Technology',
  'Priya Sharma',
  'recruitment@google.com',
  '+91-8765432100',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. INSERT SAMPLE JOB DRIVES
-- ============================================================================

INSERT INTO job_drives (
  recruiter_id, title, description, job_type, location,
  salary_package, eligibility_criteria, minimum_cgpa,
  allowed_branches, allowed_batches, registration_deadline,
  drive_date, status, created_by
)
VALUES (
  'b5a9e55c-1d7c-4978-abff-be99d79346de',
  'Software Engineer - Full Time',
  'Join Google as a Software Engineer. Work on cutting-edge technologies and build products used by billions.',
  'FTE',
  'Bangalore, India',
  35.00,
  'B.Tech in CS/IT with minimum CGPA 7.5',
  7.5,
  ARRAY['Computer Science', 'Electronics'],
  ARRAY[2023, 2024],
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '14 days',
  'OPEN',
  'c965e676-dbde-419f-b891-7f6d8f9486c7'
);

-- ============================================================================
-- 5. INSERT SAMPLE INTERVIEW ROUNDS
-- ============================================================================

INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'Online Coding Assessment',
  'CODING',
  1,
  NOW() + INTERVAL '5 days'
FROM job_drives jd
WHERE jd.title LIKE '%Software Engineer%'
LIMIT 1;

INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'Technical Interview',
  'TECHNICAL',
  2,
  NOW() + INTERVAL '7 days'
FROM job_drives jd
WHERE jd.title LIKE '%Software Engineer%'
LIMIT 1;

-- ============================================================================
-- 6. INSERT SAMPLE APPLICATIONS
-- ============================================================================

INSERT INTO applications (student_id, job_drive_id, current_status)
SELECT
  '4f9477b7-5c99-4a9e-999a-c57023528243',
  jd.id,
  'APPLIED'
FROM job_drives jd
WHERE jd.title LIKE '%Software Engineer%'
LIMIT 1;

-- ============================================================================
-- 7. INSERT SAMPLE NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (user_id, title, message, type)
VALUES (
  'c965e676-dbde-419f-b891-7f6d8f9486c7',
  'New Application Received',
  'Raj Kumar has applied for Software Engineer position at Google',
  'ALERT'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Uncomment to verify data was inserted:
-- SELECT * FROM profiles;
-- SELECT * FROM students;
-- SELECT * FROM recruiters;
-- SELECT * FROM job_drives;
-- SELECT COUNT(*) as applications_count FROM applications;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
