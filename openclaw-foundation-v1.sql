-- =============================================
-- OPENCLAW FOUNDATION v1
-- Multi-project, caching, tasks, artifacts, sources, budgets, evals
-- =============================================

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 0) HELPER: STANDARD COLUMNS
-- (We won't use a custom type to keep it simple)
-- =============================================

-- =============================================
-- 1) PROJECTS
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed your current project (safe to run multiple times)
INSERT INTO projects(project, description)
VALUES ('disney_app', 'Disney information + tools app powered by OpenClaw agents')
ON CONFLICT (project) DO NOTHING;

-- =============================================
-- 2) SOURCES REGISTRY (Trust + allowlist)
-- =============================================
CREATE TABLE IF NOT EXISTS sources_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  domain TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'unknown', -- official/news/blog/social/forum/unknown
  trust_score INTEGER NOT NULL DEFAULT 50, -- 0-100
  allowed BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  last_reviewed TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project, domain)
);

CREATE INDEX IF NOT EXISTS idx_sources_registry_project
  ON sources_registry(project);

-- =============================================
-- 3) ARTIFACTS (Reports/files you can re-open without regenerating)
-- =============================================
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  env TEXT NOT NULL DEFAULT 'dev', -- dev/prod
  artifact_type TEXT NOT NULL, -- report/digest/export/prompt_pack/etc
  title TEXT NOT NULL,
  content_markdown TEXT,
  storage_url TEXT, -- optional if you upload to storage later
  generated_by TEXT, -- Walt/Basil/Felix/Goofy/Ralph
  source_cache_keys TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artifacts_project
  ON artifacts(project);
CREATE INDEX IF NOT EXISTS idx_artifacts_type
  ON artifacts(artifact_type);

-- =============================================
-- 4) TASK QUEUE (Walt writes tasks, agents consume)
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  env TEXT NOT NULL DEFAULT 'dev',
  agent TEXT NOT NULL, -- Basil/Felix/Goofy/Ralph/Walt
  task_type TEXT NOT NULL, -- scout_wait_times/scout_merch/generate_posts/etc
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'queued', -- queued/running/succeeded/failed/skipped
  priority INTEGER NOT NULL DEFAULT 5, -- 1 highest, 10 lowest
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  lease_until TIMESTAMP, -- simple "lock" so only one worker picks it up
  result JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON tasks(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_project
  ON tasks(project, env);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON tasks;
CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================
-- 5) COST BUDGET + COST LOG (Budget governor)
-- =============================================
CREATE TABLE IF NOT EXISTS cost_budget (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  env TEXT NOT NULL DEFAULT 'dev',
  monthly_usd_limit NUMERIC NOT NULL DEFAULT 25,
  warn_80 BOOLEAN NOT NULL DEFAULT true,
  stop_95 BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project, env)
);

INSERT INTO cost_budget(project, env, monthly_usd_limit)
VALUES ('disney_app','dev',25)
ON CONFLICT (project, env) DO NOTHING;

CREATE TABLE IF NOT EXISTS agent_cost_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  env TEXT NOT NULL DEFAULT 'dev',
  agent_name TEXT,
  task_id UUID,
  model_used TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  tokens_total NUMERIC GENERATED ALWAYS AS (coalesce(tokens_input,0) + coalesce(tokens_output,0)) STORED,
  cost_usd NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_costlog_month
  ON agent_cost_log(project, env, created_at);

-- =============================================
-- 6) EVALUATION LOOP (Ralph scores output quality)
-- =============================================
CREATE TABLE IF NOT EXISTS eval_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  task_type TEXT NOT NULL,
  rubric JSONB NOT NULL DEFAULT '{}'::jsonb, -- scoring weights/criteria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project, task_type)
);

-- Example rubrics (edit anytime)
INSERT INTO eval_rubrics(project, task_type, rubric)
VALUES
  ('disney_app','basil_scout','{"correctness":0.35,"freshness":0.25,"source_quality":0.25,"usefulness":0.15}'::jsonb),
  ('disney_app','goofy_social','{"originality":0.40,"relevance":0.25,"clarity":0.20,"brand_fit":0.15}'::jsonb)
ON CONFLICT (project, task_type) DO NOTHING;

CREATE TABLE IF NOT EXISTS eval_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  env TEXT NOT NULL DEFAULT 'dev',
  task_id UUID,
  agent_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb, -- {correctness:0-10,...}
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eval_project
  ON eval_scores(project, env, created_at);

-- =============================================
-- 7) IMPROVED LOGS (Walt writes everything here too)
-- =============================================
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL DEFAULT 'disney_app',
  env TEXT NOT NULL DEFAULT 'dev',
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  model_used TEXT,
  cache_status TEXT, -- hit/miss/refresh
  cache_key TEXT,
  tokens_estimated INTEGER,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agentlogs_project
  ON agent_logs(project, env, created_at);

-- =============================================
-- 8) UPGRADE YOUR EXISTING TABLES (if they exist)
-- Add project/env/tags + hash + better indexes for dedupe
-- =============================================

-- EVENTS
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS project TEXT NOT NULL DEFAULT 'disney_app',
  ADD COLUMN IF NOT EXISTS env TEXT NOT NULL DEFAULT 'dev',
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS item_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_events_project
  ON events(project, env);
CREATE INDEX IF NOT EXISTS idx_events_cachekey
  ON events(cache_key);

-- MERCH
ALTER TABLE IF EXISTS merch
  ADD COLUMN IF NOT EXISTS project TEXT NOT NULL DEFAULT 'disney_app',
  ADD COLUMN IF NOT EXISTS env TEXT NOT NULL DEFAULT 'dev',
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS item_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_merch_project
  ON merch(project, env);
CREATE INDEX IF NOT EXISTS idx_merch_cachekey
  ON merch(cache_key);

-- WAIT TIMES
ALTER TABLE IF EXISTS wait_times
  ADD COLUMN IF NOT EXISTS project TEXT NOT NULL DEFAULT 'disney_app',
  ADD COLUMN IF NOT EXISTS env TEXT NOT NULL DEFAULT 'dev',
  ADD COLUMN IF NOT EXISTS item_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_wait_project
  ON wait_times(project, env);
CREATE INDEX IF NOT EXISTS idx_wait_cachekey
  ON wait_times(cache_key);

-- SOCIAL POSTS
ALTER TABLE IF EXISTS social_posts
  ADD COLUMN IF NOT EXISTS project TEXT NOT NULL DEFAULT 'disney_app',
  ADD COLUMN IF NOT EXISTS env TEXT NOT NULL DEFAULT 'dev',
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS item_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_social_project
  ON social_posts(project, env);

-- TRANSPORT ROUTES
ALTER TABLE IF EXISTS transport_routes
  ADD COLUMN IF NOT EXISTS project TEXT NOT NULL DEFAULT 'disney_app',
  ADD COLUMN IF NOT EXISTS env TEXT NOT NULL DEFAULT 'dev',
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS item_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_routes_project
  ON transport_routes(project, env);
CREATE INDEX IF NOT EXISTS idx_routes_cachekey
  ON transport_routes(cache_key);

-- =============================================
-- 9) OPTIONAL: SIMPLE HASHING FUNCTION (for dedupe)
-- Use: item_hash = md5(normalized_string)
-- =============================================
CREATE OR REPLACE FUNCTION normalize_text(input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(coalesce(input,''), '\s+', ' ', 'g'));
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- END SCRIPT
-- ============================================
