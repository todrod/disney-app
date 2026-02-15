-- =============================================
-- Supabase Memory Schema for All Agents
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- BASIL: Disney Intelligence Memory
-- TTL: 4 hours
-- =============================================
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

-- =============================================
-- FELIX: App Structure & Build Memory
-- TTL: 24 hours
-- =============================================
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

-- =============================================
-- GOOFY: Disney Social Media Memory
-- TTL: 12 hours
-- =============================================
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

-- =============================================
-- RALPH: Agent Memory (TBD Role)
-- TTL: 24 hours
-- =============================================
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

-- =============================================
-- WALT: Strategic Planning Memory
-- TTL: 7 days
-- =============================================
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
-- Enable Row Level Security (RLS)
-- =============================================
ALTER TABLE basil_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE felix_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE goofy_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ralph_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE walt_memory ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies: Allow public read/write (anon key)
-- =============================================
-- For demo purposes, allow anon access
-- In production, you may want service-level access only

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

-- =============================================
-- Update Timestamp Trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- =============================================
-- Test Data (Optional - can be deleted)
-- =============================================
INSERT INTO basil_memory (key, data, expires_at)
VALUES (
  'test:disney-news',
  '{"test": "true", "message": "Basil memory is working!"}',
  NOW() + INTERVAL '4 hours'
) ON CONFLICT (key) DO NOTHING;

INSERT INTO felix_memory (key, data, expires_at)
VALUES (
  'test:architecture',
  '{"test": "true", "message": "Felix memory is working!"}',
  NOW() + INTERVAL '24 hours'
) ON CONFLICT (key) DO NOTHING;

INSERT INTO goofy_memory (key, data, expires_at)
VALUES (
  'test:social-media',
  '{"test": "true", "message": "Goofy memory is working!"}',
  NOW() + INTERVAL '12 hours'
) ON CONFLICT (key) DO NOTHING;

INSERT INTO ralph_memory (key, data, expires_at)
VALUES (
  'test:ralph',
  '{"test": "true", "message": "Ralph memory is working!"}',
  NOW() + INTERVAL '24 hours'
) ON CONFLICT (key) DO NOTHING;

INSERT INTO walt_memory (key, data, expires_at)
VALUES (
  'test:strategy',
  '{"test": "true", "message": "Walt memory is working!"}',
  NOW() + INTERVAL '7 days'
) ON CONFLICT (key) DO NOTHING;

-- =============================================
-- Summary
-- =============================================
-- Created 5 tables: basil_memory, felix_memory, goofy_memory, ralph_memory, walt_memory
-- Each has: id, key, data (JSONB), expires_at, created_at, updated_at
-- TTL configured per agent
-- RLS enabled with anon access
-- Indexes on key and expires_at for performance
-- =============================================
