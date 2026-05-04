-- Add instructions column to assignments table
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS instructions TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS feedback TEXT,
ADD COLUMN IF NOT EXISTS graded_at TIMESTAMP WITH TIME ZONE;



ALTER TABLE profiles
ADD COLUMN late_penalty_percent INTEGER DEFAULT 0;


\dt