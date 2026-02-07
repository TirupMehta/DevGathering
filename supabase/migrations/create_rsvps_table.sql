-- DevGathering RSVPs Table
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    role VARCHAR(255),
    linkedin_url VARCHAR(500),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(event_id, email)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access" ON rsvps
    FOR ALL
    USING (true)
    WITH CHECK (true);
