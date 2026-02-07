-- Dev Gathering MVP - Supabase Setup Script
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ===========================================
-- 1. SUBSCRIBERS TABLE (for email notifications)
-- ===========================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(is_active) WHERE is_active = true;

-- RLS for subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage subscribers" ON subscribers
  FOR ALL USING (true) WITH CHECK (true);

-- ===========================================
-- 2. CITY REQUESTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS city_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  role TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_city_requests_city ON city_requests(city);
CREATE INDEX IF NOT EXISTS idx_city_requests_email ON city_requests(email);

-- RLS for city_requests
ALTER TABLE city_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage city_requests" ON city_requests
  FOR ALL USING (true) WITH CHECK (true);

-- ===========================================
-- 3. EVENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT,
  venue TEXT,
  event_date TIMESTAMPTZ,
  capacity INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published) WHERE is_published = true;

-- RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage events" ON events
  FOR ALL USING (true) WITH CHECK (true);

-- ===========================================
-- 4. EVENT REGISTRATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  qr_token_hash TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  checked_in_at TIMESTAMPTZ,
  UNIQUE(event_id, email)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON event_registrations(email);

-- RLS for registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage registrations" ON event_registrations
  FOR ALL USING (true) WITH CHECK (true);

-- ===========================================
-- DONE!
-- ===========================================
SELECT 'Dev Gathering database setup complete!' as status;
