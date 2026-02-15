-- =============================================
-- SUPABASE ENHANCED SCHEMA
-- Includes generic agent memory + specialized data tables
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- GENERIC AGENT MEMORY TABLES (Flexible Caching)
-- =============================================

-- BASIL: Disney Intelligence Memory (TTL: 4 hours)
CREATE TABLE IF NOT EXISTS basil_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS basil_memory_key_idx ON basil_memory(key);
CREATE INDEX IF NOT EXISTS basil_memory_expires_at_idx ON basil_memory(expires_at);

-- FELIX: App Structure & Build Memory (TTL: 24 hours)
CREATE TABLE IF NOT EXISTS felix_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS felix_memory_key_idx ON felix_memory(key);
CREATE INDEX IF NOT EXISTS felix_memory_expires_at_idx ON felix_memory(expires_at);

-- GOOFY: Disney Social Media Memory (TTL: 12 hours)
CREATE TABLE IF NOT EXISTS goofy_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS goofy_memory_key_idx ON goofy_memory(key);
CREATE INDEX IF NOT EXISTS goofy_memory_expires_at_idx ON goofy_memory(expires_at);

-- RALPH: Testing Memory (TTL: 24 hours)
CREATE TABLE IF NOT EXISTS ralph_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ralph_memory_key_idx ON ralph_memory(key);
CREATE INDEX IF NOT EXISTS ralph_memory_expires_at_idx ON ralph_memory(expires_at);

-- WALT: Strategic Planning Memory (TTL: 7 days)
CREATE TABLE IF NOT EXISTS walt_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS walt_memory_key_idx ON walt_memory(key);
CREATE INDEX IF NOT EXISTS walt_memory_expires_at_idx ON walt_memory(expires_at);

-- =============================================
-- SPECIALIZED STRUCTURED DATA TABLES
-- =============================================

-- EVENTS (Basil discoveries: shows, festivals, announcements)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  park TEXT NOT NULL,
  location TEXT,
  event_date DATE,
  description TEXT,
  source TEXT,
  confidence FLOAT DEFAULT 1.0,
  cache_key TEXT UNIQUE,
  ttl INTEGER DEFAULT 43200, -- 12 hours default (Walt's rule)
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_cache_key_idx ON events(cache_key);
CREATE INDEX IF NOT EXISTS events_park_idx ON events(park);
CREATE INDEX IF NOT EXISTS events_event_date_idx ON events(event_date);

-- MERCH / POPCORN BUCKETS / LIMITED ITEMS
CREATE TABLE IF NOT EXISTS merch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  park TEXT NOT NULL,
  location TEXT,
  release_date DATE,
  description TEXT,
  source TEXT,
  cache_key TEXT UNIQUE,
  ttl INTEGER DEFAULT 86400, -- 24 hours default (Walt's rule)
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS merch_cache_key_idx ON merch(cache_key);
CREATE INDEX IF NOT EXISTS merch_park_idx ON merch(park);
CREATE INDEX IF NOT EXISTS merch_name_idx ON merch(name);

-- RIDE WAIT TIMES (frequent updates - every 5-10 minutes)
CREATE TABLE IF NOT EXISTS wait_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride TEXT NOT NULL,
  park TEXT NOT NULL,
  minutes INTEGER,
  cache_key TEXT UNIQUE,
  ttl INTEGER DEFAULT 600, -- 10 minutes default
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wait_times_cache_key_idx ON wait_times(cache_key);
CREATE INDEX IF NOT EXISTS wait_times_park_idx ON wait_times(park);
CREATE INDEX IF NOT EXISTS wait_times_ride_idx ON wait_times(ride);

-- SOCIAL CONTENT PIPELINE (Goofy agent)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_title TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  media_required TEXT,
  cache_key TEXT UNIQUE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS social_posts_cache_key_idx ON social_posts(cache_key);
CREATE INDEX IF NOT EXISTS social_posts_title_idx ON social_posts(post_title);

-- FAST TRAVEL ROUTES (transport tool)
CREATE TABLE IF NOT EXISTS transport_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  route_steps JSONB,
  est_minutes INTEGER,
  cache_key TEXT UNIQUE,
  ttl INTEGER DEFAULT 2592000, -- 30 days default (Walt's rule), exception: 24h on construction
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS transport_routes_cache_key_idx ON transport_routes(cache_key);
CREATE INDEX IF NOT EXISTS transport_routes_start_idx ON transport_routes(start_location);
CREATE INDEX IF NOT EXISTS transport_routes_end_idx ON transport_routes(end_location);

-- SYSTEM LOGS (Walt oversight)
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  model_used TEXT,
  cache_status TEXT, -- 'cache_hit' | 'cache_miss' | 'bypass'
  tokens_estimated INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS agent_logs_agent_name_idx ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS agent_logs_created_at_idx ON agent_logs(created_at);
CREATE INDEX IF NOT EXISTS agent_logs_cache_status_idx ON agent_logs(cache_status);

-- =============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

-- Generic memory tables
ALTER TABLE basil_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE felix_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE goofy_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ralph_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE walt_memory ENABLE ROW LEVEL SECURITY;

-- Specialized tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch ENABLE ROW LEVEL SECURITY;
ALTER TABLE wait_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES: Allow public read/write (anon key)
-- =============================================

-- Generic memory policies
CREATE POLICY "Allow anon access on basil_memory"
  ON basil_memory FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on felix_memory"
  ON felix_memory FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on goofy_memory"
  ON goofy_memory FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on ralph_memory"
  ON ralph_memory FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on walt_memory"
  ON walt_memory FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Specialized tables policies
CREATE POLICY "Allow anon access on events"
  ON events FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on merch"
  ON merch FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on wait_times"
  ON wait_times FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on social_posts"
  ON social_posts FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on transport_routes"
  ON transport_routes FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon access on agent_logs"
  ON agent_logs FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- =============================================
-- UPDATE TIMESTAMP TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generic memory triggers
CREATE TRIGGER basil_memory_updated_at BEFORE UPDATE ON basil_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER felix_memory_updated_at BEFORE UPDATE ON felix_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER goofy_memory_updated_at BEFORE UPDATE ON goofy_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER ralph_memory_updated_at BEFORE UPDATE ON ralph_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER walt_memory_updated_at BEFORE UPDATE ON walt_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Specialized tables triggers
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER merch_updated_at BEFORE UPDATE ON merch
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER wait_times_updated_at BEFORE UPDATE ON wait_times
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER social_posts_updated_at BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER transport_routes_updated_at BEFORE UPDATE ON transport_routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TEST DATA (Optional - can be deleted)
-- =============================================

-- Test event
INSERT INTO events (title, park, event_date, description, confidence, cache_key, ttl)
VALUES (
  'EPCOT Festival of the Arts',
  'EPCOT',
  '2026-02-16',
  'Annual arts festival with performances, food booths, and art displays.',
  1.0,
  'test:epcot:festival-arts',
  14400
) ON CONFLICT (cache_key) DO NOTHING;

-- Test merch
INSERT INTO merch (name, park, location, description, cache_key, ttl)
VALUES (
  'Limited Edition Popcorn Bucket',
  'Magic Kingdom',
  'Main Street Confectionery',
  'Exclusive 2026 festival popcorn bucket with LED lights.',
  'test:mk:popcorn-bucket',
  28800
) ON CONFLICT (cache_key) DO NOTHING;

-- Test wait time
INSERT INTO wait_times (ride, park, minutes, cache_key, ttl)
VALUES (
  'Space Mountain',
  'Magic Kingdom',
  45,
  'test:mk:space-mountain',
  600
) ON CONFLICT (cache_key) DO NOTHING;

-- Test social post
INSERT INTO social_posts (post_title, caption, hashtags, cache_key)
VALUES (
  '5 Must-Try Snacks at Disney Springs',
  'Planning your visit to Disney Springs? Don’t miss these 5 iconic treats!',
  ARRAY['#DisneySprings', '#DisneyFood', '#DisneySnacks'],
  'test:social:disney-springs-snacks'
) ON CONFLICT (cache_key) DO NOTHING;

-- Test transport route
INSERT INTO transport_routes (start_location, end_location, route_steps, est_minutes, cache_key, ttl)
VALUES (
  'Magic Kingdom',
  'EPCOT',
  '[{"step": "Walk to Transportation Center", "time": 5}, {"step": "Take Monorail", "time": 15}]',
  20,
  'test:transport:mk-to-epcot',
  86400
) ON CONFLICT (cache_key) DO NOTHING;

-- Test agent log
INSERT INTO agent_logs (agent_name, action, model_used, cache_status, tokens_estimated)
VALUES (
  'Basil',
  'Disney intelligence gathering',
  'GLM-4.7',
  'cache_miss',
  5000
);

-- =============================================
-- SUMMARY
-- =============================================
-- GENERIC MEMORY TABLES (Flexible JSONB storage):
--   - basil_memory (TTL: 4h)
--   - felix_memory (TTL: 24h)
--   - goofy_memory (TTL: 12h)
--   - ralph_memory (TTL: 24h)
--   - walt_memory (TTL: 7d)
--
-- SPECIALIZED STRUCTURED TABLES:
--   - events (shows, festivals, announcements)
--   - merch (popcorn buckets, limited items)
--   - wait_times (ride wait times, 10min TTL)
--   - social_posts (Goofy content pipeline)
--   - transport_routes (fast travel routing)
--   - agent_logs (Walt oversight, performance tracking)
--
-- All tables have RLS enabled with anon access
-- Indexes on frequently queried fields
-- Auto-update triggers for timestamps
-- =============================================
