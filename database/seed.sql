-- ============================================================================
-- PLACEMENT MANAGEMENT SYSTEM - SEED DATA
-- Example data for development and testing
-- ============================================================================

-- NOTE: This seed data assumes you have already created the auth.users via Supabase Auth
-- For testing purposes, you may need to manually insert UUIDs that match your auth users

-- ============================================================================
-- 1. INSERT SAMPLE PROFILES
-- ============================================================================

-- Admin user
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  gen_random_uuid(), -- Replace with actual auth user ID
  'Admin User',
  'admin@college.edu',
  '+91-9876543210',
  'ADMIN',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Placement Officer
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  gen_random_uuid(), -- Replace with actual auth user ID
  'Dr. Ramesh Kumar',
  'placement@college.edu',
  '+91-9876543211',
  'PLACEMENT_OFFICER',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. INSERT SAMPLE STUDENTS
-- ============================================================================

INSERT INTO students (
  id, roll_number, branch, batch_year, cgpa, backlogs, 
  skills, is_eligible, placement_status
)
VALUES (
  gen_random_uuid(), -- Replace with actual auth user ID
  'CSE001',
  'Computer Science',
  2023,
  8.5,
  0,
  ARRAY['Python', 'React', 'Node.js', 'PostgreSQL'],
  true,
  'NOT_PLACED'
),
(
  gen_random_uuid(),
  'CSE002',
  'Computer Science',
  2023,
  9.0,
  0,
  ARRAY['Java', 'Spring Boot', 'AWS', 'Docker'],
  true,
  'PLACED'
),
(
  gen_random_uuid(),
  'ECE001',
  'Electronics & Communication',
  2023,
  7.8,
  0,
  ARRAY['Embedded Systems', 'VHDL', 'Signal Processing'],
  true,
  'NOT_PLACED'
),
(
  gen_random_uuid(),
  'MECH001',
  'Mechanical Engineering',
  2023,
  7.5,
  1,
  ARRAY['CAD', 'MATLAB', 'Thermodynamics'],
  false,
  'NOT_PLACED'
),
(
  gen_random_uuid(),
  'CSE003',
  'Computer Science',
  2022,
  8.9,
  0,
  ARRAY['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
  true,
  'PLACED'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. INSERT SAMPLE RECRUITERS
-- ============================================================================

INSERT INTO recruiters (
  id, company_name, company_description, company_website,
  industry, hr_contact_name, hr_contact_email, hr_contact_phone,
  is_verified
)
VALUES (
  gen_random_uuid(), -- Replace with actual auth user ID
  'Google India',
  'Technology giant with focus on search, advertising, and cloud solutions',
  'https://careers.google.com/jobs',
  'Technology',
  'Priya Sharma',
  'recruitment@google.com',
  '+91-8765432100',
  true
),
(
  gen_random_uuid(),
  'Infosys Limited',
  'Leading global IT services and consulting company',
  'https://www.infosys.com/careers',
  'IT Services',
  'Vijay Kumar',
  'campus-hire@infosys.com',
  '+91-8765432101',
  true
),
(
  gen_random_uuid(),
  'Amazon India',
  'E-commerce and cloud computing leader',
  'https://www.amazon.jobs',
  'E-commerce & Cloud',
  'Neha Singh',
  'recruitin@amazon.in',
  '+91-8765432102',
  true
),
(
  gen_random_uuid(),
  'Goldman Sachs',
  'Leading global investment banking and financial services company',
  'https://www.goldmansachs.com/careers',
  'Finance',
  'Arun Patel',
  'india-campus@gs.com',
  '+91-8765432103',
  true
),
(
  gen_random_uuid(),
  'Microsoft India',
  'Cloud, AI, and enterprise software solutions',
  'https://careers.microsoft.com',
  'Technology',
  'Anjali Verma',
  'campus@microsoft.com',
  '+91-8765432104',
  true
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. INSERT SAMPLE JOB DRIVES
-- ============================================================================

-- Get recruiter IDs (you'll need to replace these with actual IDs)
-- For testing, assuming first recruiter is Google, second is Infosys, etc.

-- Google FTE Drive
INSERT INTO job_drives (
  recruiter_id, title, description, job_type, location,
  salary_package, eligibility_criteria, minimum_cgpa,
  allowed_branches, allowed_batches, registration_deadline,
  drive_date, status, created_by
)
SELECT
  r.id,
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
  p.id
FROM recruiters r
CROSS JOIN profiles p
WHERE r.company_name = 'Google India'
AND p.role = 'PLACEMENT_OFFICER'
LIMIT 1;

-- Infosys Internship Drive
INSERT INTO job_drives (
  recruiter_id, title, description, job_type, location,
  salary_package, eligibility_criteria, minimum_cgpa,
  allowed_branches, allowed_batches, registration_deadline,
  drive_date, status, created_by
)
SELECT
  r.id,
  'Systems Engineer Internship',
  'Join Infosys as an intern and gain hands-on experience in enterprise software development.',
  'INTERN',
  'Pune, India',
  0.50,
  'B.Tech students with minimum CGPA 6.5',
  6.5,
  ARRAY['Computer Science', 'IT', 'Electronics'],
  ARRAY[2024, 2025],
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '12 days',
  'OPEN',
  p.id
FROM recruiters r
CROSS JOIN profiles p
WHERE r.company_name = 'Infosys Limited'
AND p.role = 'PLACEMENT_OFFICER'
LIMIT 1;

-- Amazon PPO Drive
INSERT INTO job_drives (
  recruiter_id, title, description, job_type, location,
  salary_package, eligibility_criteria, minimum_cgpa,
  allowed_branches, allowed_batches, registration_deadline,
  drive_date, status, created_by
)
SELECT
  r.id,
  'SDE - PPO Conversion',
  'Amazon Summer Intern to FTE offer. High potential interns with strong performance.',
  'PPO',
  'Bangalore, India',
  42.00,
  'Current or recent Amazon interns with top performance ratings',
  8.0,
  ARRAY['Computer Science'],
  ARRAY[2023],
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '10 days',
  'CLOSED',
  p.id
FROM recruiters r
CROSS JOIN profiles p
WHERE r.company_name = 'Amazon India'
AND p.role = 'PLACEMENT_OFFICER'
LIMIT 1;

-- Goldman Sachs Quant Drive
INSERT INTO job_drives (
  recruiter_id, title, description, job_type, location,
  salary_package, eligibility_criteria, minimum_cgpa,
  allowed_branches, allowed_batches, registration_deadline,
  drive_date, status, created_by
)
SELECT
  r.id,
  'Quantitative Analyst - FTE',
  'Join Goldman Sachs Quant team. Work on high-frequency trading and financial modeling.',
  'FTE',
  'Mumbai, India',
  55.00,
  'B.Tech/B.Sc with strong math and programming skills. CGPA > 8.0',
  8.0,
  ARRAY['Computer Science', 'Mathematics', 'Physics'],
  ARRAY[2023],
  NOW() + INTERVAL '6 days',
  NOW() + INTERVAL '13 days',
  'OPEN',
  p.id
FROM recruiters r
CROSS JOIN profiles p
WHERE r.company_name = 'Goldman Sachs'
AND p.role = 'PLACEMENT_OFFICER'
LIMIT 1;

-- Microsoft Cloud Drive
INSERT INTO job_drives (
  recruiter_id, title, description, job_type, location,
  salary_package, eligibility_criteria, minimum_cgpa,
  allowed_branches, allowed_batches, registration_deadline,
  drive_date, status, created_by
)
SELECT
  r.id,
  'Cloud Solutions Developer - FTE',
  'Build cloud solutions using Azure, develop enterprise applications.',
  'FTE',
  'Hyderabad, India',
  32.00,
  'B.Tech CS/IT with cloud or web development experience',
  7.2,
  ARRAY['Computer Science', 'IT'],
  ARRAY[2023, 2024],
  NOW() + INTERVAL '8 days',
  NOW() + INTERVAL '15 days',
  'OPEN',
  p.id
FROM recruiters r
CROSS JOIN profiles p
WHERE r.company_name = 'Microsoft India'
AND p.role = 'PLACEMENT_OFFICER'
LIMIT 1;

-- ============================================================================
-- 5. INSERT SAMPLE INTERVIEW ROUNDS
-- ============================================================================

-- Sample rounds for Google drive
INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'Online Coding Assessment',
  'CODING',
  1,
  NOW() + INTERVAL '5 days'
FROM job_drives jd
WHERE jd.title LIKE '%Software Engineer%'
AND jd.recruiter_id IN (SELECT id FROM recruiters WHERE company_name = 'Google India')
LIMIT 1;

INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'Technical Interview - Round 1',
  'TECHNICAL',
  2,
  NOW() + INTERVAL '7 days'
FROM job_drives jd
WHERE jd.title LIKE '%Software Engineer%'
AND jd.recruiter_id IN (SELECT id FROM recruiters WHERE company_name = 'Google India')
LIMIT 1;

INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'Technical Interview - Round 2',
  'TECHNICAL',
  3,
  NOW() + INTERVAL '9 days'
FROM job_drives jd
WHERE jd.title LIKE '%Software Engineer%'
AND jd.recruiter_id IN (SELECT id FROM recruiters WHERE company_name = 'Google India')
LIMIT 1;

INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'HR Round',
  'HR',
  4,
  NOW() + INTERVAL '11 days'
FROM job_drives jd
WHERE jd.title LIKE '%Software Engineer%'
AND jd.recruiter_id IN (SELECT id FROM recruiters WHERE company_name = 'Google India')
LIMIT 1;

-- Sample rounds for Infosys drive
INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'Aptitude Test',
  'APTITUDE',
  1,
  NOW() + INTERVAL '4 days'
FROM job_drives jd
WHERE jd.title LIKE '%Systems Engineer Internship%'
LIMIT 1;

INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
SELECT
  jd.id,
  'Technical Interview',
  'TECHNICAL',
  2,
  NOW() + INTERVAL '6 days'
FROM job_drives jd
WHERE jd.title LIKE '%Systems Engineer Internship%'
LIMIT 1;

-- ============================================================================
-- 6. INSERT SAMPLE APPLICATIONS
-- ============================================================================

-- CSE001 applies for Google
INSERT INTO applications (student_id, job_drive_id, current_status)
SELECT
  s.id,
  jd.id,
  'APPLIED'
FROM students s
CROSS JOIN job_drives jd
WHERE s.roll_number = 'CSE001'
AND jd.title LIKE '%Software Engineer%'
AND jd.recruiter_id IN (SELECT id FROM recruiters WHERE company_name = 'Google India')
LIMIT 1;

-- CSE002 applies for Google (already placed, different status)
INSERT INTO applications (student_id, job_drive_id, current_status)
SELECT
  s.id,
  jd.id,
  'SHORTLISTED'
FROM students s
CROSS JOIN job_drives jd
WHERE s.roll_number = 'CSE002'
AND jd.title LIKE '%Software Engineer%'
AND jd.recruiter_id IN (SELECT id FROM recruiters WHERE company_name = 'Google India')
LIMIT 1;

-- CSE001 applies for Infosys
INSERT INTO applications (student_id, job_drive_id, current_status)
SELECT
  s.id,
  jd.id,
  'APPLIED'
FROM students s
CROSS JOIN job_drives jd
WHERE s.roll_number = 'CSE001'
AND jd.title LIKE '%Systems Engineer Internship%'
LIMIT 1;

-- ECE001 applies for Infosys
INSERT INTO applications (student_id, job_drive_id, current_status)
SELECT
  s.id,
  jd.id,
  'APPLIED'
FROM students s
CROSS JOIN job_drives jd
WHERE s.roll_number = 'ECE001'
AND jd.title LIKE '%Systems Engineer Internship%'
LIMIT 1;

-- CSE003 applied for Goldman Sachs (already placed)
INSERT INTO applications (student_id, job_drive_id, current_status)
SELECT
  s.id,
  jd.id,
  'ACCEPTED'
FROM students s
CROSS JOIN job_drives jd
WHERE s.roll_number = 'CSE003'
AND jd.title LIKE '%Quantitative Analyst%'
LIMIT 1;

-- CSE002 applies for Microsoft
INSERT INTO applications (student_id, job_drive_id, current_status)
SELECT
  s.id,
  jd.id,
  'INTERVIEW'
FROM students s
CROSS JOIN job_drives jd
WHERE s.roll_number = 'CSE002'
AND jd.title LIKE '%Cloud Solutions Developer%'
LIMIT 1;

-- ============================================================================
-- 7. INSERT SAMPLE INTERVIEW RESULTS
-- ============================================================================

-- CSE002's Google interview results
INSERT INTO interview_results (application_id, round_id, status, feedback)
SELECT
  a.id,
  ir.id,
  CASE WHEN ir.round_order = 1 THEN 'PASS' ELSE 'PENDING' END,
  CASE WHEN ir.round_order = 1 THEN 'Good problem-solving skills' ELSE NULL END
FROM applications a
CROSS JOIN interview_rounds ir
WHERE a.current_status = 'SHORTLISTED'
AND ir.job_drive_id = a.job_drive_id
AND ir.round_order <= 1;

-- ============================================================================
-- 8. INSERT SAMPLE OFFERS
-- ============================================================================

-- CSE003 accepted offer from Goldman Sachs
INSERT INTO offers (application_id, offered_salary, offer_status)
SELECT
  a.id,
  55.00,
  'ACCEPTED'
FROM applications a
WHERE a.current_status = 'ACCEPTED';

-- CSE002 pending offer from Google
INSERT INTO offers (application_id, offered_salary, offer_status)
SELECT
  a.id,
  35.00,
  'PENDING'
FROM applications a
WHERE a.current_status = 'SHORTLISTED'
AND a.student_id IN (SELECT id FROM students WHERE roll_number = 'CSE002')
LIMIT 1;

-- ============================================================================
-- 9. INSERT SAMPLE NOTIFICATIONS
-- ============================================================================

-- Notification for placement officer about new applications
INSERT INTO notifications (user_id, title, message, type)
SELECT
  p.id,
  'New Applications Received',
  'You have received 2 new applications for the Google Software Engineer drive',
  'ALERT'
FROM profiles p
WHERE p.role = 'PLACEMENT_OFFICER'
LIMIT 1;

-- Notification for student about shortlisting
INSERT INTO notifications (user_id, title, message, type)
SELECT
  s.id,
  'Shortlisted!',
  'Congratulations! You have been shortlisted for Google Software Engineer position',
  'SUCCESS'
FROM students s
WHERE s.roll_number = 'CSE002'
LIMIT 1;

-- Notification for student about offer
INSERT INTO notifications (user_id, title, message, type)
SELECT
  s.id,
  'Offer Received',
  'You have received an offer from Goldman Sachs as Quantitative Analyst',
  'SUCCESS'
FROM students s
WHERE s.roll_number = 'CSE003'
LIMIT 1;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================

-- NOTE: Remember to replace all gen_random_uuid() calls with actual auth.users IDs
-- You can get these from Supabase Auth dashboard and update the initial INSERTs
