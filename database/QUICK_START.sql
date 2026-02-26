-- ============================================================================
-- QUICK START GUIDE & COMMON QUERIES
-- Copy-paste ready SQL snippets for common operations
-- ============================================================================

-- ============================================================================
-- 1. USER MANAGEMENT
-- ============================================================================

-- Create a new student profile
-- NOTE: First create auth user via Supabase Auth, then run this
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  'user-uuid-here', -- Get from auth.users
  'John Doe',
  'john@college.edu',
  '+91-9876543210',
  'STUDENT',
  true
);

-- Add student details
INSERT INTO students (id, roll_number, branch, batch_year, cgpa, backlogs, skills, is_eligible)
VALUES (
  'user-uuid-here',
  'CSE2023001',
  'Computer Science',
  2023,
  8.5,
  0,
  ARRAY['Python', 'React', 'PostgreSQL'],
  true
);

-- Create a recruiter profile
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES ('recruiter-uuid', 'HR Manager', 'hr@company.com', '+91-9123456789', 'RECRUITER', true);

INSERT INTO recruiters (id, company_name, company_description, company_website, industry, is_verified)
VALUES (
  'recruiter-uuid',
  'Tech Corp',
  'Leading technology solutions provider',
  'https://techcorp.com',
  'Technology',
  false -- Wait for placement officer to verify
);

-- Verify a recruiter (Placement Officer only)
UPDATE recruiters
SET is_verified = true
WHERE id = 'recruiter-uuid';

-- ============================================================================
-- 2. JOB DRIVE OPERATIONS
-- ============================================================================

-- Create a new job drive
INSERT INTO job_drives (
  recruiter_id, title, description, job_type, location,
  salary_package, minimum_cgpa, allowed_branches, allowed_batches,
  registration_deadline, drive_date, status, created_by
)
VALUES (
  'recruiter-uuid',
  'Software Engineer - Full Stack',
  'We are looking for talented software engineers...',
  'FTE',
  'Bangalore, India',
  28.00,
  7.0,
  ARRAY['Computer Science', 'IT'],
  ARRAY[2023, 2024],
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '14 days',
  'OPEN',
  'placement-officer-uuid'
)
RETURNING id;

-- Update job drive status
UPDATE job_drives
SET status = 'CLOSED'
WHERE id = 'drive-id'
AND recruiter_id = auth.uid(); -- Only recruiter can update own drive

-- Check eligible students for a drive
SELECT s.id, s.full_name, s.cgpa, s.branch
FROM students s
WHERE s.cgpa >= (SELECT minimum_cgpa FROM job_drives WHERE id = 'drive-id')
AND s.branch = ANY((SELECT allowed_branches FROM job_drives WHERE id = 'drive-id'))
AND s.batch_year = ANY((SELECT allowed_batches FROM job_drives WHERE id = 'drive-id'))
AND s.is_eligible = true;

-- ============================================================================
-- 3. APPLICATION MANAGEMENT
-- ============================================================================

-- Student applies to a job drive
INSERT INTO applications (student_id, job_drive_id, current_status)
VALUES (auth.uid(), 'job-drive-uuid', 'APPLIED')
ON CONFLICT (student_id, job_drive_id) DO NOTHING; -- Prevent duplicate

-- Retrieve student's applications with full details
SELECT
  a.id,
  a.current_status,
  a.applied_at,
  jd.title,
  jd.salary_package,
  r.company_name,
  jd.drive_date,
  COUNT(ir.id) as total_rounds
FROM applications a
INNER JOIN job_drives jd ON a.job_drive_id = jd.id
INNER JOIN recruiters r ON jd.recruiter_id = r.id
LEFT JOIN interview_rounds ir ON jd.id = ir.job_drive_id
WHERE a.student_id = auth.uid()
GROUP BY a.id, a.current_status, a.applied_at, jd.id, r.id
ORDER BY a.applied_at DESC;

-- Get application funnel (conversion at each stage)
SELECT
  current_status,
  COUNT(*) as count,
  ROUND(COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM applications) * 100, 2) as percentage
FROM applications
GROUP BY current_status
ORDER BY CASE current_status
  WHEN 'APPLIED' THEN 1
  WHEN 'SHORTLISTED' THEN 2
  WHEN 'INTERVIEW' THEN 3
  WHEN 'OFFERED' THEN 4
  WHEN 'ACCEPTED' THEN 5
  ELSE 6
END;

-- ============================================================================
-- 4. INTERVIEW MANAGEMENT
-- ============================================================================

-- Create interview rounds for a job drive
INSERT INTO interview_rounds (job_drive_id, round_name, round_type, round_order, scheduled_date)
VALUES
  ('drive-uuid', 'Coding Challenge', 'CODING', 1, NOW() + INTERVAL '5 days'),
  ('drive-uuid', 'Technical Interview', 'TECHNICAL', 2, NOW() + INTERVAL '7 days'),
  ('drive-uuid', 'HR Interview', 'HR', 3, NOW() + INTERVAL '9 days');

-- Get interview schedule for a student
SELECT
  ir.round_name,
  ir.round_type,
  ir.round_order,
  ir.scheduled_date,
  jd.title,
  r.company_name
FROM applications a
INNER JOIN job_drives jd ON a.job_drive_id = jd.id
INNER JOIN recruiters r ON jd.recruiter_id = r.id
INNER JOIN interview_rounds ir ON jd.id = ir.job_drive_id
WHERE a.student_id = auth.uid()
AND a.current_status IN ('INTERVIEW', 'SHORTLISTED')
ORDER BY ir.round_order;

-- Record interview result
INSERT INTO interview_results (application_id, round_id, status, feedback, evaluated_by, evaluated_at)
VALUES (
  'application-uuid',
  'round-uuid',
  'PASS',
  'Excellent coding skills and problem-solving approach',
  auth.uid(), -- Evaluator
  NOW()
);

-- Check interview progress for an application
SELECT
  ir.round_name,
  ir.round_type,
  ires.status,
  ires.feedback,
  ires.evaluated_at
FROM applications a
INNER JOIN interview_rounds ir ON a.job_drive_id = ir.job_drive_id
LEFT JOIN interview_results ires ON (a.id = ires.application_id AND ir.id = ires.round_id)
WHERE a.id = 'application-uuid'
ORDER BY ir.round_order;

-- ============================================================================
-- 5. OFFER MANAGEMENT
-- ============================================================================

-- Create job offer
INSERT INTO offers (application_id, offered_salary, offer_status, offer_letter_url)
VALUES (
  'application-uuid',
  32.00,
  'PENDING',
  'https://storage.supabase.co/offer_letters/...'
)
RETURNING id;

-- Student accepts offer
UPDATE offers
SET offer_status = 'ACCEPTED',
    responded_at = NOW()
WHERE id = 'offer-uuid'
AND EXISTS (
  SELECT 1 FROM applications a
  WHERE a.id = offers.application_id
  AND a.student_id = auth.uid()
);
-- NOTE: Trigger automatically updates student.placement_status = 'PLACED'

-- Get student's offers
SELECT
  o.id,
  o.offered_salary,
  o.offer_status,
  o.issued_at,
  jd.title,
  r.company_name
FROM applications a
INNER JOIN offers o ON a.id = o.application_id
INNER JOIN job_drives jd ON a.job_drive_id = jd.id
INNER JOIN recruiters r ON jd.recruiter_id = r.id
WHERE a.student_id = auth.uid()
ORDER BY o.issued_at DESC;

-- ============================================================================
-- 6. NOTIFICATION QUERIES
-- ============================================================================

-- Manually create notification (also auto-created by triggers)
INSERT INTO notifications (user_id, title, message, type, related_entity_id)
VALUES (
  'user-uuid',
  'Application Shortlisted',
  'Your application for Google has been shortlisted. Next round details will be shared soon.',
  'SUCCESS',
  'application-uuid'
);

-- Get unread notifications for current user
SELECT * FROM notifications
WHERE user_id = auth.uid()
AND is_read = false
ORDER BY created_at DESC
LIMIT 10;

-- Mark notifications as read
UPDATE notifications
SET is_read = true
WHERE user_id = auth.uid()
AND is_read = false;

-- Get notification summary
SELECT
  type,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_read = false) as unread
FROM notifications
WHERE user_id = auth.uid()
GROUP BY type;

-- ============================================================================
-- 7. PLACEMENT STATISTICS (ADMIN & PLACEMENT OFFICER)
-- ============================================================================

-- Overall placement statistics
SELECT
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN s.placement_status = 'PLACED' THEN s.id END) as placed_students,
  COUNT(DISTINCT CASE WHEN s.placement_status = 'NOT_PLACED' THEN s.id END) as unplaced_students,
  ROUND(
    COUNT(DISTINCT CASE WHEN s.placement_status = 'PLACED' THEN s.id END)::NUMERIC /
    COUNT(DISTINCT s.id) * 100, 2
  ) as placement_rate_percent,
  ROUND(AVG(
    CASE WHEN o.offer_status = 'ACCEPTED' THEN o.offered_salary END
  ), 2) as avg_salary_offered
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
LEFT JOIN offers o ON a.id = o.application_id;

-- Placement by branch
SELECT
  branch,
  COUNT(*) as total_students,
  COUNT(*) FILTER (WHERE placement_status = 'PLACED') as placed,
  ROUND(
    COUNT(*) FILTER (WHERE placement_status = 'PLACED')::NUMERIC / COUNT(*) * 100, 2
  ) as placement_rate_percent
FROM students
GROUP BY branch
ORDER BY placement_rate_percent DESC;

-- Placement by batch/year
SELECT
  batch_year,
  COUNT(*) as total_students,
  COUNT(*) FILTER (WHERE placement_status = 'PLACED') as placed,
  ROUND(
    COUNT(*) FILTER (WHERE placement_status = 'PLACED')::NUMERIC / COUNT(*) * 100, 2
  ) as placement_rate_percent
FROM students
GROUP BY batch_year
ORDER BY batch_year DESC;

-- Company-wise recruitment stats
SELECT
  r.company_name,
  r.industry,
  COUNT(DISTINCT jd.id) as total_drives,
  COUNT(DISTINCT a.id) as total_applications,
  COUNT(DISTINCT CASE WHEN a.current_status = 'SHORTLISTED' THEN a.id END) as shortlisted,
  COUNT(DISTINCT CASE WHEN o.offer_status = 'ACCEPTED' THEN o.id END) as hired,
  ROUND(AVG(o.offered_salary), 2) as avg_salary
FROM recruiters r
LEFT JOIN job_drives jd ON r.id = jd.recruiter_id
LEFT JOIN applications a ON jd.id = a.job_drive_id
LEFT JOIN offers o ON a.id = o.application_id
WHERE r.is_verified = true
GROUP BY r.id, r.company_name, r.industry
ORDER BY hired DESC;

-- ============================================================================
-- 8. DATA MAINTENANCE & CLEANUP
-- ============================================================================

-- Mark student as ineligible (after blacklisting)
UPDATE students
SET placement_status = 'BLACKLISTED',
    is_eligible = false,
    updated_at = NOW()
WHERE id = 'student-uuid';

-- Reject all applications for a blacklisted student
UPDATE applications
SET current_status = 'REJECTED',
    updated_at = NOW()
WHERE student_id = 'blacklisted-student-uuid'
AND current_status NOT IN ('ACCEPTED', 'DECLINED');

-- Mark expired offers as expired
UPDATE offers
SET offer_status = 'EXPIRED'
WHERE offer_status = 'PENDING'
AND issued_at < NOW() - INTERVAL '30 days';

-- Archive completed drives
UPDATE job_drives
SET status = 'COMPLETED'
WHERE status = 'CLOSED'
AND drive_date < NOW() - INTERVAL '7 days';

-- ============================================================================
-- 9. AUDIT & COMPLIANCE
-- ============================================================================

-- Track all changes to placement_status
SELECT
  s.id,
  s.roll_number,
  s.placement_status,
  s.updated_at
FROM students s
WHERE s.updated_at > NOW() - INTERVAL '30 days'
ORDER BY s.updated_at DESC;

-- Get all offer-to-placement conversions
SELECT
  s.roll_number,
  r.company_name,
  jd.title,
  o.offered_salary,
  o.issued_at,
  o.responded_at,
  o.offer_status,
  (o.responded_at - o.issued_at) as days_to_respond
FROM students s
INNER JOIN applications a ON s.id = a.student_id
INNER JOIN job_drives jd ON a.job_drive_id = jd.id
INNER JOIN recruiters r ON jd.recruiter_id = r.id
INNER JOIN offers o ON a.id = o.application_id
WHERE o.offer_status IN ('ACCEPTED', 'DECLINED')
ORDER BY o.issued_at DESC;

-- ============================================================================
-- 10. ADVANCED QUERIES FOR ANALYTICS
-- ============================================================================

-- Average time-to-placement for students
SELECT
  s.batch_year,
  ROUND(AVG(EXTRACT(DAY FROM (o.issued_at - a.applied_at))), 2) as avg_days_to_offer,
  COUNT(*) as num_placed
FROM students s
INNER JOIN applications a ON s.id = a.student_id
INNER JOIN job_drives jd ON a.job_drive_id = jd.id
INNER JOIN offers o ON a.id = o.application_id
WHERE o.offer_status = 'ACCEPTED'
GROUP BY s.batch_year
ORDER BY s.batch_year DESC;

-- Interview round effectiveness (pass rate)
SELECT
  ir.round_type,
  ir.round_name,
  COUNT(ires.id) as total_interviews,
  COUNT(*) FILTER (WHERE ires.status = 'PASS') as passed,
  COUNT(*) FILTER (WHERE ires.status = 'FAIL') as failed,
  ROUND(
    COUNT(*) FILTER (WHERE ires.status = 'PASS')::NUMERIC /
    NULLIF(COUNT(*), 0) * 100, 2
  ) as pass_rate_percent
FROM interview_rounds ir
LEFT JOIN interview_results ires ON ir.id = ires.round_id
WHERE ir.scheduled_date < NOW()
GROUP BY ir.round_type, ir.round_name
ORDER BY pass_rate_percent DESC;

-- Top performing students (by offers)
SELECT
  p.full_name,
  s.roll_number,
  s.branch,
  s.cgpa,
  COUNT(DISTINCT CASE WHEN o.offer_status = 'ACCEPTED' THEN o.id END) as offers_accepted,
  ROUND(AVG(o.offered_salary), 2) as avg_salary,
  ARRAY_AGG(DISTINCT r.company_name) as companies_selected_by
FROM students s
INNER JOIN profiles p ON s.id = p.id
LEFT JOIN applications a ON s.id = a.student_id
LEFT JOIN offers o ON a.id = o.application_id
LEFT JOIN job_drives jd ON a.job_drive_id = jd.id
LEFT JOIN recruiters r ON jd.recruiter_id = r.id
WHERE o.offer_status = 'ACCEPTED'
GROUP BY s.id, p.id, s.roll_number, s.branch, s.cgpa
ORDER BY offers_accepted DESC, avg_salary DESC
LIMIT 20;

-- ============================================================================
-- END OF QUICK START GUIDE
-- ============================================================================
