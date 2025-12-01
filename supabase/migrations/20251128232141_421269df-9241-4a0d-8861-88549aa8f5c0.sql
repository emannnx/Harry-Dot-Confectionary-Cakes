-- Create cakes table
CREATE TABLE public.cakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'custom',
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_attempts table for PIN lockout tracking
CREATE TABLE public.admin_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cakes table
ALTER TABLE public.cakes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published cakes
CREATE POLICY "Anyone can view published cakes"
  ON public.cakes
  FOR SELECT
  USING (is_published = true);

-- Allow all operations for authenticated admin (we'll handle PIN auth in edge function)
CREATE POLICY "Allow all operations via service role"
  ON public.cakes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable RLS on admin_attempts
ALTER TABLE public.admin_attempts ENABLE ROW LEVEL SECURITY;

-- Allow public access to admin_attempts for the edge function
CREATE POLICY "Allow all for admin attempts"
  ON public.admin_attempts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cakes_updated_at
  BEFORE UPDATE ON public.cakes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for cake images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cakes', 'cakes', true);

-- Create storage policies for the cakes bucket
CREATE POLICY "Anyone can view cake images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cakes');

CREATE POLICY "Anyone can upload cake images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'cakes');

CREATE POLICY "Anyone can update cake images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'cakes');

CREATE POLICY "Anyone can delete cake images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'cakes');