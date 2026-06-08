-- Create pilot_requests table for shadow audit form submissions
CREATE TABLE public.pilot_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  compute_environment TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pilot_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for public inserts (no auth required for form submissions)
CREATE POLICY "Anyone can submit pilot requests" 
ON public.pilot_requests 
FOR INSERT 
WITH CHECK (true);

-- Admin read access would be configured separately via dashboard