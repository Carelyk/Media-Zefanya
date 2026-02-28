
-- Table for student submissions
CREATE TABLE public.student_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  table_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  multisensory_notes TEXT DEFAULT '',
  description_text TEXT DEFAULT '',
  score INTEGER DEFAULT 0,
  total_keywords INTEGER DEFAULT 0,
  matched_keywords INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public access since no auth (teacher views all, students submit with name only)
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (students submit without login)
CREATE POLICY "Anyone can submit" ON public.student_submissions FOR INSERT WITH CHECK (true);

-- Allow anyone to read (teacher views results without login)
CREATE POLICY "Anyone can read submissions" ON public.student_submissions FOR SELECT USING (true);

-- Storage bucket for multisensory photos
INSERT INTO storage.buckets (id, name, public) VALUES ('item-photos', 'item-photos', true);

CREATE POLICY "Anyone can view item photos" ON storage.objects FOR SELECT USING (bucket_id = 'item-photos');
CREATE POLICY "Anyone can upload item photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'item-photos');
