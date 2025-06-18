
-- Add a column to store trade screenshots/images
ALTER TABLE public.trades ADD COLUMN screenshot_url TEXT;

-- Create a storage bucket for trade screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trade-screenshots', 'trade-screenshots', true);

-- Create RLS policies for the trade screenshots bucket
CREATE POLICY "Users can upload their own trade screenshots" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'trade-screenshots' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own trade screenshots" ON storage.objects
FOR SELECT USING (
  bucket_id = 'trade-screenshots' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own trade screenshots" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'trade-screenshots' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own trade screenshots" ON storage.objects
FOR DELETE USING (
  bucket_id = 'trade-screenshots' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
