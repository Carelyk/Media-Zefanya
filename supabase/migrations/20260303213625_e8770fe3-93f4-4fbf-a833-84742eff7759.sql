
-- Create a settings table to store teacher password hash
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- No one can read settings directly from client
CREATE POLICY "No direct access to settings"
  ON public.app_settings FOR SELECT
  USING (false);

-- No client inserts/updates
CREATE POLICY "No direct writes to settings"
  ON public.app_settings FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No direct updates to settings"
  ON public.app_settings FOR UPDATE
  USING (false);

-- Drop the permissive SELECT policy on student_submissions
DROP POLICY IF EXISTS "Anyone can read submissions" ON public.student_submissions;

-- Replace with a restrictive policy - no direct client reads
CREATE POLICY "No direct read access"
  ON public.student_submissions FOR SELECT
  USING (false);
