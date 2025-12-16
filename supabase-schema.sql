-- Create the certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  cert_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  duration TEXT NOT NULL,
  institution TEXT NOT NULL,
  issue_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on cert_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_cert_number ON certificates(cert_number);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_created_at ON certificates(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to SELECT (read) certificates
CREATE POLICY "Allow public read access" ON certificates
  FOR SELECT USING (true);

-- Policy: Allow INSERT (create) for authenticated users or public
-- Note: For production, you should restrict this to authenticated admin users only
CREATE POLICY "Allow public insert access" ON certificates
  FOR INSERT WITH CHECK (true);

-- Policy: Allow UPDATE for authenticated users or public
-- Note: For production, you should restrict this to authenticated admin users only
CREATE POLICY "Allow public update access" ON certificates
  FOR UPDATE USING (true);

-- Policy: Allow DELETE for authenticated users or public
-- Note: For production, you should restrict this to authenticated admin users only
CREATE POLICY "Allow public delete access" ON certificates
  FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO certificates (cert_number, student_name, course, duration, institution, issue_date) VALUES
  ('IHWC2025001', 'John Smith', 'Holistic Health Practitioner', '12 Months', 'IHWC Training Center, Mumbai', '2025-01-15'),
  ('IHWC2025002', 'Sarah Johnson', 'Wellness Coaching Certification', '6 Months', 'IHWC Academy, Delhi', '2025-02-10'),
  ('IHWC2025003', 'Michael Brown', 'Integrative Nutrition Specialist', '9 Months', 'IHWC Institute, Bangalore', '2025-03-05'),
  ('IHWC2025004', 'Emily Davis', 'Mindfulness & Meditation Guide', '3 Months', 'IHWC Center, Pune', '2025-04-20'),
  ('IHWC2025005', 'David Wilson', 'Yoga Therapy Certification', '18 Months', 'IHWC Training Center, Chennai', '2025-05-12')
ON CONFLICT (cert_number) DO NOTHING;
