-- ============================================================================
-- PLACEMENT MANAGEMENT SYSTEM - SUPABASE SCHEMA
-- Production-Ready Database Design
-- ============================================================================

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'PLACEMENT_OFFICER', 'STUDENT', 'RECRUITER');

CREATE TYPE job_type AS ENUM ('INTERN', 'FTE', 'PPO');

CREATE TYPE job_drive_status AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'COMPLETED');

CREATE TYPE placement_status AS ENUM ('NOT_PLACED', 'PLACED', 'BLACKLISTED');

CREATE TYPE application_status AS ENUM (
  'APPLIED',
  'SHORTLISTED',
  'REJECTED',
  'INTERVIEW',
  'OFFERED',
  'ACCEPTED',
  'DECLINED'
);

CREATE TYPE interview_round_type AS ENUM ('APTITUDE', 'TECHNICAL', 'HR', 'GD', 'CODING');

CREATE TYPE interview_result_status AS ENUM ('PASS', 'FAIL', 'PENDING');

CREATE TYPE offer_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

CREATE TYPE notification_type AS ENUM ('INFO', 'ALERT', 'SUCCESS');

-- ============================================================================
-- 2. MAIN TABLES
-- ============================================================================

-- ============================================================================
-- Table: profiles
-- Extends Supabase auth.users with additional profile information
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'STUDENT',
  profile_picture_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\+?[0-9\-\(\) ]{10,}$')
);

-- ============================================================================
-- Table: students
-- Student-specific information and application data
-- ============================================================================
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  roll_number VARCHAR(50) NOT NULL UNIQUE,
  branch VARCHAR(100) NOT NULL,
  batch_year INTEGER NOT NULL,
  cgpa NUMERIC(3,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  backlogs INTEGER NOT NULL DEFAULT 0 CHECK (backlogs >= 0),
  skills TEXT[] DEFAULT '{}',
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  is_eligible BOOLEAN NOT NULL DEFAULT true,
  placement_status placement_status NOT NULL DEFAULT 'NOT_PLACED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_batch_year CHECK (batch_year >= 2010 AND batch_year <= 2100)
);

-- ============================================================================
-- Table: recruiters
-- Recruiter/company information and verification
-- ============================================================================
CREATE TABLE recruiters (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  company_description TEXT,
  company_website TEXT,
  company_logo_url TEXT,
  industry VARCHAR(100),
  hr_contact_name VARCHAR(255),
  hr_contact_email VARCHAR(255),
  hr_contact_phone VARCHAR(20),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT unique_company_per_user UNIQUE (id, company_name),
  CONSTRAINT valid_website_url CHECK (company_website IS NULL OR company_website ~ '^https?://')
);

-- ============================================================================
-- Table: job_drives
-- Job posting and drive information
-- ============================================================================
CREATE TABLE job_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  job_type job_type NOT NULL,
  location VARCHAR(255),
  salary_package NUMERIC(10,2) NOT NULL CHECK (salary_package > 0),
  eligibility_criteria TEXT,
  minimum_cgpa NUMERIC(3,2) CHECK (minimum_cgpa >= 0 AND minimum_cgpa <= 10),
  allowed_branches TEXT[] DEFAULT '{}',
  allowed_batches INTEGER[] DEFAULT '{}',
  registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  drive_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status job_drive_status NOT NULL DEFAULT 'DRAFT',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (registration_deadline < drive_date),
  CONSTRAINT drive_date_future CHECK (drive_date > now())
);

-- ============================================================================
-- Table: applications
-- Job applications with unique constraint per student per job
-- ============================================================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_drive_id UUID NOT NULL REFERENCES job_drives(id) ON DELETE CASCADE,
  current_status application_status NOT NULL DEFAULT 'APPLIED',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(student_id, job_drive_id),
  CONSTRAINT valid_application_date CHECK (applied_at <= now())
);

-- ============================================================================
-- Table: interview_rounds
-- Interview round definitions for each job drive
-- ============================================================================
CREATE TABLE interview_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_drive_id UUID NOT NULL REFERENCES job_drives(id) ON DELETE CASCADE,
  round_name VARCHAR(255) NOT NULL,
  round_type interview_round_type NOT NULL,
  round_order INTEGER NOT NULL CHECK (round_order > 0),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(job_drive_id, round_order)
);

-- ============================================================================
-- Table: interview_results
-- Results of interview rounds for each application
-- ============================================================================
CREATE TABLE interview_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  round_id UUID NOT NULL REFERENCES interview_rounds(id) ON DELETE CASCADE,
  status interview_result_status NOT NULL DEFAULT 'PENDING',
  feedback TEXT,
  evaluated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  evaluated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(application_id, round_id)
);

-- ============================================================================
-- Table: offers
-- Job offers to candidates
-- ============================================================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  offered_salary NUMERIC(10,2) NOT NULL CHECK (offered_salary > 0),
  offer_letter_url TEXT,
  offer_status offer_status NOT NULL DEFAULT 'PENDING',
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(application_id)
);

-- ============================================================================
-- Table: notifications
-- Real-time notifications for all users
-- ============================================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'INFO',
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profile indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- Student indexes
CREATE INDEX idx_students_branch ON students(branch);
CREATE INDEX idx_students_batch_year ON students(batch_year);
CREATE INDEX idx_students_placement_status ON students(placement_status);
CREATE INDEX idx_students_is_eligible ON students(is_eligible);
CREATE INDEX idx_students_cgpa ON students(cgpa);
CREATE INDEX idx_students_updated_at ON students(updated_at);

-- Recruiter indexes
CREATE INDEX idx_recruiters_is_verified ON recruiters(is_verified);
CREATE INDEX idx_recruiters_industry ON recruiters(industry);

-- Job drive indexes
CREATE INDEX idx_job_drives_recruiter_id ON job_drives(recruiter_id);
CREATE INDEX idx_job_drives_status ON job_drives(status);
CREATE INDEX idx_job_drives_created_by ON job_drives(created_by);
CREATE INDEX idx_job_drives_drive_date ON job_drives(drive_date);
CREATE INDEX idx_job_drives_registration_deadline ON job_drives(registration_deadline);

-- Application indexes
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_job_drive_id ON applications(job_drive_id);
CREATE INDEX idx_applications_status ON applications(current_status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
CREATE INDEX idx_applications_student_job ON applications(student_id, job_drive_id);

-- Interview round indexes
CREATE INDEX idx_interview_rounds_job_drive_id ON interview_rounds(job_drive_id);
CREATE INDEX idx_interview_rounds_round_type ON interview_rounds(round_type);

-- Interview result indexes
CREATE INDEX idx_interview_results_application_id ON interview_results(application_id);
CREATE INDEX idx_interview_results_round_id ON interview_results(round_id);
CREATE INDEX idx_interview_results_status ON interview_results(status);
CREATE INDEX idx_interview_results_evaluated_by ON interview_results(evaluated_by);

-- Offer indexes
CREATE INDEX idx_offers_application_id ON offers(application_id);
CREATE INDEX idx_offers_status ON offers(offer_status);
CREATE INDEX idx_offers_issued_at ON offers(issued_at);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- All users can view all profiles (but only admins see sensitive data)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (handled by auth trigger)
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- STUDENTS POLICIES
-- ============================================================================

-- Students can view all student profiles
CREATE POLICY "students_select" ON students
  FOR SELECT USING (true);

-- Students can update their own record
CREATE POLICY "students_update_own" ON students
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND placement_status = (
      SELECT placement_status FROM students WHERE id = auth.uid()
    )
  );

-- Students cannot modify placement_status directly
CREATE POLICY "students_prevent_status_change" ON students
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Placement officers can update student records
CREATE POLICY "students_officer_update" ON students
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'PLACEMENT_OFFICER'
    )
  );

-- Admins have full access
CREATE POLICY "students_admin_all" ON students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- RECRUITERS POLICIES
-- ============================================================================

-- All users can view verified recruiters
CREATE POLICY "recruiters_select" ON recruiters
  FOR SELECT USING (is_verified = true OR auth.uid() = id);

-- Recruiters can update their own record
CREATE POLICY "recruiters_update_own" ON recruiters
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins and placement officers can verify recruiters
CREATE POLICY "recruiters_admin_update" ON recruiters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
    )
  );

-- Admins have full access
CREATE POLICY "recruiters_admin_all" ON recruiters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- JOB_DRIVES POLICIES
-- ============================================================================

-- All authenticated users can view open job drives
CREATE POLICY "job_drives_select" ON job_drives
  FOR SELECT USING (
    status = 'OPEN' OR
    auth.uid() = recruiter_id OR
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
    )
  );

-- Recruiters can create and update their own job drives
CREATE POLICY "job_drives_recruiter_insert" ON job_drives
  FOR INSERT WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "job_drives_recruiter_update" ON job_drives
  FOR UPDATE USING (auth.uid() = recruiter_id)
  WITH CHECK (auth.uid() = recruiter_id);

-- Placement officers can create and manage job drives
CREATE POLICY "job_drives_officer_all" ON job_drives
  FOR ALL USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'PLACEMENT_OFFICER'
    )
  );

-- Admins have full access
CREATE POLICY "job_drives_admin_all" ON job_drives
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- APPLICATIONS POLICIES
-- ============================================================================

-- Students can view their own applications
CREATE POLICY "applications_student_select" ON applications
  FOR SELECT USING (auth.uid() = student_id);

-- Placement officers and recruiters can view all applications relevant to them
CREATE POLICY "applications_officer_select" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
    ) OR
    EXISTS (
      SELECT 1 FROM job_drives jd
      WHERE jd.id = applications.job_drive_id
      AND jd.recruiter_id = auth.uid()
    )
  );

-- Students can create applications
CREATE POLICY "applications_student_insert" ON applications
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Recruiters can update application status
CREATE POLICY "applications_recruiter_update" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM job_drives jd
      WHERE jd.id = applications.job_drive_id
      AND jd.recruiter_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "applications_admin_all" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- INTERVIEW_ROUNDS POLICIES
-- ============================================================================

CREATE POLICY "interview_rounds_select" ON interview_rounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_drives jd
      WHERE jd.id = interview_rounds.job_drive_id
      AND (
        jd.recruiter_id = auth.uid() OR
        jd.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
        )
      )
    )
  );

CREATE POLICY "interview_rounds_insert_update" ON interview_rounds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM job_drives jd
      WHERE jd.id = interview_rounds.job_drive_id
      AND (
        jd.recruiter_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
        )
      )
    )
  );

-- ============================================================================
-- INTERVIEW_RESULTS POLICIES
-- ============================================================================

CREATE POLICY "interview_results_select" ON interview_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = interview_results.application_id
      AND (
        a.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM job_drives jd
          WHERE jd.id = a.job_drive_id
          AND (
            jd.recruiter_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM profiles
              WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
            )
          )
        )
      )
    )
  );

CREATE POLICY "interview_results_insert_update" ON interview_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM interview_rounds ir
      INNER JOIN job_drives jd ON ir.job_drive_id = jd.id
      WHERE ir.id = interview_results.round_id
      AND (
        jd.recruiter_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
        )
      )
    )
  );

-- ============================================================================
-- OFFERS POLICIES
-- ============================================================================

CREATE POLICY "offers_select" ON offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = offers.application_id
      AND (
        a.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM job_drives jd
          WHERE jd.id = a.job_drive_id
          AND (
            jd.recruiter_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM profiles
              WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
            )
          )
        )
      )
    )
  );

CREATE POLICY "offers_recruiter_insert_update" ON offers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM applications a
      INNER JOIN job_drives jd ON a.job_drive_id = jd.id
      WHERE a.id = offers.application_id
      AND (
        jd.recruiter_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role IN ('ADMIN', 'PLACEMENT_OFFICER')
        )
      )
    )
  );

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all notifications
CREATE POLICY "notifications_admin_select" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- System can insert notifications
CREATE POLICY "notifications_insert_system" ON notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 5. TRIGGERS AND FUNCTIONS
-- ============================================================================

-- ============================================================================
-- Function: Set placement_status to PLACED when offer is ACCEPTED
-- ============================================================================
CREATE OR REPLACE FUNCTION set_placement_status_on_offer_accepted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.offer_status = 'ACCEPTED' THEN
    UPDATE students
    SET placement_status = 'PLACED',
        updated_at = now()
    WHERE id = (
      SELECT student_id FROM applications WHERE id = NEW.application_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for offer status change
CREATE TRIGGER trigger_placement_status_on_offer
AFTER UPDATE OF offer_status ON offers
FOR EACH ROW
EXECUTE FUNCTION set_placement_status_on_offer_accepted();

-- ============================================================================
-- Function: Create notification for placement officer when application is created
-- ============================================================================
CREATE OR REPLACE FUNCTION create_notification_on_application()
RETURNS TRIGGER AS $$
DECLARE
  v_student_name VARCHAR;
  v_job_title VARCHAR;
  v_officer_id UUID;
BEGIN
  -- Get student name and job title
  SELECT s.id, p.full_name INTO STRICT v_student_name, v_student_name
  FROM students s
  INNER JOIN profiles p ON s.id = p.id
  WHERE s.id = NEW.student_id;

  SELECT jd.title INTO v_job_title
  FROM job_drives jd
  WHERE jd.id = NEW.job_drive_id;

  -- Get first placement officer
  SELECT id INTO v_officer_id
  FROM profiles
  WHERE role = 'PLACEMENT_OFFICER'
  LIMIT 1;

  IF v_officer_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, related_entity_id)
    VALUES (
      v_officer_id,
      'New Application Submitted',
      v_student_name || ' has applied for ' || v_job_title,
      'ALERT',
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new application
CREATE TRIGGER trigger_notification_on_application
AFTER INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION create_notification_on_application();

-- ============================================================================
-- Function: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables with updated_at
CREATE TRIGGER trigger_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_students_timestamp
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_recruiters_timestamp
BEFORE UPDATE ON recruiters
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_job_drives_timestamp
BEFORE UPDATE ON job_drives
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_applications_timestamp
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_offers_timestamp
BEFORE UPDATE ON offers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_notifications_timestamp
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- 6. ANALYTICS VIEWS (Optional but recommended)
-- ============================================================================

-- ============================================================================
-- View: Placement rate by batch
-- ============================================================================
CREATE OR REPLACE VIEW placement_rate_by_batch AS
SELECT
  s.batch_year,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN s.placement_status = 'PLACED' THEN s.id END) as placed_students,
  ROUND(
    COUNT(DISTINCT CASE WHEN s.placement_status = 'PLACED' THEN s.id END)::NUMERIC /
    COUNT(DISTINCT s.id) * 100,
    2
  ) as placement_rate_percent
FROM students s
GROUP BY s.batch_year
ORDER BY s.batch_year DESC;

-- ============================================================================
-- View: Placement rate by branch
-- ============================================================================
CREATE OR REPLACE VIEW placement_rate_by_branch AS
SELECT
  s.branch,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN s.placement_status = 'PLACED' THEN s.id END) as placed_students,
  ROUND(
    COUNT(DISTINCT CASE WHEN s.placement_status = 'PLACED' THEN s.id END)::NUMERIC /
    COUNT(DISTINCT s.id) * 100,
    2
  ) as placement_rate_percent
FROM students s
GROUP BY s.branch
ORDER BY placement_rate_percent DESC;

-- ============================================================================
-- View: Company-wise hiring statistics
-- ============================================================================
CREATE OR REPLACE VIEW company_hiring_stats AS
SELECT
  r.company_name,
  r.industry,
  COUNT(DISTINCT jd.id) as total_drives,
  COUNT(DISTINCT a.id) as total_applications,
  COUNT(DISTINCT CASE WHEN a.current_status = 'ACCEPTED' THEN a.id END) as total_selected,
  COUNT(DISTINCT CASE WHEN o.offer_status = 'ACCEPTED' THEN o.id END) as total_offers_accepted,
  ROUND(AVG(jd.salary_package), 2) as avg_salary_offered
FROM recruiters r
LEFT JOIN job_drives jd ON r.id = jd.recruiter_id
LEFT JOIN applications a ON jd.id = a.job_drive_id
LEFT JOIN offers o ON a.id = o.application_id
WHERE r.is_verified = true
GROUP BY r.id, r.company_name, r.industry
ORDER BY total_selected DESC;

-- ============================================================================
-- View: Application conversion funnel
-- ============================================================================
CREATE OR REPLACE VIEW application_conversion_funnel AS
SELECT
  'Applied' as stage,
  COUNT(DISTINCT id) as count
FROM applications
WHERE current_status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'DECLINED')

UNION ALL

SELECT
  'Shortlisted' as stage,
  COUNT(DISTINCT id) as count
FROM applications
WHERE current_status IN ('SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'DECLINED')

UNION ALL

SELECT
  'Interview' as stage,
  COUNT(DISTINCT id) as count
FROM applications
WHERE current_status IN ('INTERVIEW', 'OFFERED', 'ACCEPTED', 'DECLINED')

UNION ALL

SELECT
  'Offered' as stage,
  COUNT(DISTINCT id) as count
FROM applications
WHERE current_status IN ('OFFERED', 'ACCEPTED', 'DECLINED')

UNION ALL

SELECT
  'Accepted' as stage,
  COUNT(DISTINCT id) as count
FROM applications
WHERE current_status = 'ACCEPTED';

-- ============================================================================
-- View: Drive performance metrics
-- ============================================================================
CREATE OR REPLACE VIEW drive_performance_metrics AS
SELECT
  jd.id,
  jd.title,
  r.company_name,
  jd.salary_package,
  COUNT(DISTINCT a.id) as total_applications,
  COUNT(DISTINCT CASE WHEN a.current_status = 'SHORTLISTED' THEN a.id END) as shortlisted,
  COUNT(DISTINCT CASE WHEN a.current_status = 'INTERVIEW' THEN a.id END) as in_interview,
  COUNT(DISTINCT CASE WHEN a.current_status IN ('OFFERED', 'ACCEPTED') THEN a.id END) as offers,
  COUNT(DISTINCT CASE WHEN a.current_status = 'ACCEPTED' THEN a.id END) as accepted,
  ROUND(
    COUNT(DISTINCT CASE WHEN a.current_status = 'ACCEPTED' THEN a.id END)::NUMERIC /
    NULLIF(COUNT(DISTINCT a.id), 0) * 100,
    2
  ) as conversion_rate_percent,
  jd.status,
  jd.drive_date
FROM job_drives jd
INNER JOIN recruiters r ON jd.recruiter_id = r.id
LEFT JOIN applications a ON jd.id = a.job_drive_id
WHERE r.is_verified = true
GROUP BY jd.id, jd.title, r.company_name, jd.salary_package, jd.status, jd.drive_date
ORDER BY jd.drive_date DESC;

-- ============================================================================
-- 7. GRANTS AND PERMISSIONS
-- ============================================================================

-- Grant appropriate permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
