-- ============================================================================
-- PLACEMENT MANAGEMENT SYSTEM - STORAGE SETUP
-- Supabase Storage bucket configuration and policies
-- ============================================================================

-- ============================================================================
-- STORAGE BUCKET STRUCTURE
-- ============================================================================

-- To set up these buckets via Supabase dashboard:
-- 1. Go to Storage > Buckets
-- 2. Create each bucket with public/private settings as indicated
-- 3. Apply the RLS policies below

/*
BUCKET STRUCTURE:

1. resumes/
   - Access: Private (authenticated users only)
   - Path structure: resumes/{student_id}/{filename}
   - Files: Student resume PDFs
   - Use case: Recruiters download resumes of shortlisted candidates
   - Retention: Keep for 2 years after graduation

2. company_logos/
   - Access: Public (anyone can read)
   - Path structure: company_logos/{recruiter_id}/{filename}
   - Files: Company logo images (PNG/JPG)
   - Use case: Display in job drive listings
   - Retention: Keep until company removes logo

3. offer_letters/
   - Access: Private (authenticated users only)
   - Path structure: offer_letters/{application_id}/{filename}
   - Files: PDF offer letters
   - Use case: Student downloads own offer, placement officer views
   - Retention: Keep for 5 years (legal requirement)

4. profile_pictures/
   - Access: Public (anyone can read)
   - Path structure: profile_pictures/{user_id}/{filename}
   - Files: User profile pictures (PNG/JPG)
   - Use case: Display in profiles and interviews
   - Retention: Keep while user account is active

5. interview_documents/
   - Access: Private (authenticated users only)
   - Path structure: interview_documents/{interview_round_id}/{filename}
   - Files: Interview notes, test papers, evaluation forms
   - Use case: Interviewers access during and after interviews
   - Retention: Keep for 2 years after interview
*/

-- ============================================================================
-- SQL COMMANDS TO CREATE STORAGE OBJECTS
-- NOTE: Raw SQL cannot create storage buckets directly
-- Use Supabase Dashboard or API instead
-- ============================================================================

-- ============================================================================
-- STORAGE POLICIES - RLS for Buckets
-- Execute these policies in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- RESUMES BUCKET POLICIES
-- ============================================================================

-- Policy 1: Students can upload their own resume
CREATE POLICY "students-can-upload-own-resume"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Students can read their own resume
CREATE POLICY "students-can-read-own-resume"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Recruiters can read resumes of shortlisted candidates they interview
CREATE POLICY "recruiters-can-read-shortlisted-resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM applications a
    INNER JOIN job_drives jd ON a.job_drive_id = jd.id
    WHERE (storage.foldername(name))[1] = a.student_id::text
    AND jd.recruiter_id = auth.uid()
    AND a.current_status IN ('SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED')
  )
);

-- Policy 4: Placement officers can read any resume
CREATE POLICY "placement-officers-can-read-any-resume"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'PLACEMENT_OFFICER'
  )
);

-- Policy 5: Admins can read any resume
CREATE POLICY "admins-can-read-any-resume"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Policy 6: Students can update their own resume
CREATE POLICY "students-can-update-own-resume"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 7: Students can delete their own resume
CREATE POLICY "students-can-delete-own-resume"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- COMPANY_LOGOS BUCKET POLICIES
-- ============================================================================

-- Policy 1: Recruiters can upload their own company logo
CREATE POLICY "recruiters-can-upload-logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company_logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Anyone can read company logos (public)
CREATE POLICY "anyone-can-read-logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'company_logos');

-- Policy 3: Recruiters can update their own logo
CREATE POLICY "recruiters-can-update-own-logo"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'company_logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Recruiters can delete their own logo
CREATE POLICY "recruiters-can-delete-own-logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company_logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- OFFER_LETTERS BUCKET POLICIES
-- ============================================================================

-- Policy 1: Recruiters can upload offer letters for their job drives
CREATE POLICY "recruiters-can-upload-offer-letters"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'offer_letters' AND
  EXISTS (
    SELECT 1 FROM offers o
    INNER JOIN applications a ON o.application_id = a.id
    INNER JOIN job_drives jd ON a.job_drive_id = jd.id
    WHERE jd.recruiter_id = auth.uid()
    AND (storage.foldername(name))[1] = a.id::text
  )
);

-- Policy 2: Students can read offers they received
CREATE POLICY "students-can-read-own-offers"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'offer_letters' AND
  EXISTS (
    SELECT 1 FROM offers o
    INNER JOIN applications a ON o.application_id = a.id
    WHERE a.student_id = auth.uid()
    AND (storage.foldername(name))[1] = a.id::text
  )
);

-- Policy 3: Placement officers can read any offer letter
CREATE POLICY "placement-officers-can-read-offer-letters"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'offer_letters' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'PLACEMENT_OFFICER'
  )
);

-- Policy 4: Recruiters can read offer letters they created
CREATE POLICY "recruiters-can-read-own-offer-letters"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'offer_letters' AND
  EXISTS (
    SELECT 1 FROM offers o
    INNER JOIN applications a ON o.application_id = a.id
    INNER JOIN job_drives jd ON a.job_drive_id = jd.id
    WHERE jd.recruiter_id = auth.uid()
    AND (storage.foldername(name))[1] = a.id::text
  )
);

-- Policy 5: Admins can read any offer letter
CREATE POLICY "admins-can-read-offer-letters"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'offer_letters' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Policy 6: Recruiters can delete offer letters
CREATE POLICY "recruiters-can-delete-offer-letters"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'offer_letters' AND
  EXISTS (
    SELECT 1 FROM offers o
    INNER JOIN applications a ON o.application_id = a.id
    INNER JOIN job_drives jd ON a.job_drive_id = jd.id
    WHERE jd.recruiter_id = auth.uid()
    AND (storage.foldername(name))[1] = a.id::text
  )
);

-- ============================================================================
-- PROFILE_PICTURES BUCKET POLICIES
-- ============================================================================

-- Policy 1: Users can upload their own profile picture
CREATE POLICY "users-can-upload-profile-picture"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile_pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Anyone can read profile pictures (public)
CREATE POLICY "anyone-can-read-profile-pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_pictures');

-- Policy 3: Users can update their own profile picture
CREATE POLICY "users-can-update-own-profile-picture"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'profile_pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own profile picture
CREATE POLICY "users-can-delete-own-profile-picture"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile_pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- INTERVIEW_DOCUMENTS BUCKET POLICIES
-- ============================================================================

-- Policy 1: Interviewers can upload interview documents
CREATE POLICY "interviewers-can-upload-documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'interview_documents' AND
  EXISTS (
    SELECT 1 FROM interview_rounds ir
    INNER JOIN job_drives jd ON ir.job_drive_id = jd.id
    WHERE jd.recruiter_id = auth.uid()
    AND (storage.foldername(name))[1] = ir.id::text
  )
);

-- Policy 2: Recruiters can read interview documents for their drives
CREATE POLICY "recruiters-can-read-interview-documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'interview_documents' AND
  EXISTS (
    SELECT 1 FROM interview_rounds ir
    INNER JOIN job_drives jd ON ir.job_drive_id = jd.id
    WHERE jd.recruiter_id = auth.uid()
    AND (storage.foldername(name))[1] = ir.id::text
  )
);

-- Policy 3: Students can read interview documents for their interviews
CREATE POLICY "students-can-read-interview-documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'interview_documents' AND
  EXISTS (
    SELECT 1 FROM applications a
    INNER JOIN interview_rounds ir ON a.job_drive_id = ir.job_drive_id
    INNER JOIN interview_results ires ON ires.application_id = a.id
    WHERE a.student_id = auth.uid()
    AND (storage.foldername(name))[1] = ir.id::text
  )
);

-- Policy 4: Placement officers can read all interview documents
CREATE POLICY "placement-officers-can-read-interview-documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'interview_documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'PLACEMENT_OFFICER'
  )
);

-- Policy 5: Admins can read all interview documents
CREATE POLICY "admins-can-read-interview-documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'interview_documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- ============================================================================
-- STORAGE HELPERS - SQL Functions for File Management
-- ============================================================================

-- Function: Generate safe file path for storage
CREATE OR REPLACE FUNCTION generate_storage_path(
  p_bucket_name TEXT,
  p_user_id UUID,
  p_filename TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN p_bucket_name || '/' || p_user_id::TEXT || '/' || p_filename;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Get file size for storage quota checking
CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id UUID)
RETURNS BIGINT AS $$
DECLARE
  v_total_size BIGINT := 0;
BEGIN
  -- This would need to be implemented via Supabase API
  -- SQL alone cannot query Storage object metadata
  RETURN v_total_size;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CLEANUP POLICY (Optional - for archive/deletion)
-- ============================================================================

-- Function: Soft delete old interview documents (older than 2 years)
-- This would typically be run as a scheduled job
CREATE OR REPLACE FUNCTION archive_old_interview_documents()
RETURNS TABLE(archived_count INTEGER) AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  UPDATE interview_rounds
  SET scheduled_date = NULL
  WHERE scheduled_date < NOW() - INTERVAL '2 years'
  AND (SELECT COUNT(*) FROM interview_results WHERE round_id = interview_rounds.id) > 0;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN QUERY SELECT v_count;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MANUAL BUCKET CREATION (via Supabase Dashboard)
-- ============================================================================

/*
STEPS TO CREATE BUCKETS IN SUPABASE DASHBOARD:

1. Go to the Supabase dashboard
2. Navigate to Storage > Buckets
3. Click "New Bucket" and create each bucket:

BUCKET 1: resumes
---------
- Name: resumes
- Public: No (unchecked)
- File size limit: 10 MB
- Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

BUCKET 2: company_logos
---------
- Name: company_logos
- Public: Yes (checked)
- File size limit: 5 MB
- Allowed MIME types: image/png, image/jpeg, image/webp

BUCKET 3: offer_letters
---------
- Name: offer_letters
- Public: No (unchecked)
- File size limit: 10 MB
- Allowed MIME types: application/pdf

BUCKET 4: profile_pictures
---------
- Name: profile_pictures
- Public: Yes (checked)
- File size limit: 3 MB
- Allowed MIME types: image/png, image/jpeg, image/webp

BUCKET 5: interview_documents
---------
- Name: interview_documents
- Public: No (unchecked)
- File size limit: 50 MB
- Allowed MIME types: application/pdf, text/plain, image/jpeg, image/png

THEN:
4. For each bucket, go to Policies tab
5. Copy-paste the relevant policies from above
6. Enable RLS by checking "RLS" toggle
7. Save policies

*/

-- ============================================================================
-- STORAGE USAGE MONITORING
-- ============================================================================

-- Create a table to track storage usage per user
CREATE TABLE IF NOT EXISTS storage_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bucket_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  operation VARCHAR(20) NOT NULL, -- 'upload', 'delete', 'update'
  operation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for storage monitoring
CREATE INDEX idx_storage_usage_user ON storage_usage_logs(user_id, operation_date);
CREATE INDEX idx_storage_usage_bucket ON storage_usage_logs(bucket_name);

-- ============================================================================
-- END OF STORAGE SETUP
-- ============================================================================
