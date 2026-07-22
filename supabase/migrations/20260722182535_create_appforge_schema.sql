/*
# AppForge — AI mobile app builder platform schema

Creates three tables for a platform where users write a text prompt describing
a mobile app, watch it build live (streaming stages), and interact with a phone
preview whose regions can be clicked to complete missing parts.

1. New Tables
- `projects`: each app-building session. Stores the original prompt, target
  platform (ios / android / both), derived app category, overall status, and
  a JSONB config blob (color scheme, feature flags, etc.).
- `build_stages`: ordered pipeline steps for a project (analyzing, scaffolding,
  designing, generating screens, database, logic, testing, deploy). Each stage
  has a status (pending / in_progress / completed / failed) and a log string.
- `app_regions`: individual screens or UI sections of the generated app. Each
  region has a type (screen / component / navigation / data), a status
  (complete / incomplete / building), a JSONB spec describing its UI elements,
  and a description of what is missing when incomplete.

2. Security
- Single-tenant app with no sign-in screen. RLS enabled on all tables.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because the data is intentionally shared/public (no user isolation needed).

3. Relationships
- build_stages.project_id → projects.id (CASCADE)
- app_regions.project_id → projects.id (CASCADE)

4. Indexes
- build_stages(project_id, sort_order)
- app_regions(project_id, sort_order)
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  prompt text NOT NULL,
  platform text NOT NULL DEFAULT 'both',
  app_type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'building',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS build_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  stage_type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'pending',
  logs text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE build_stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_build_stages" ON build_stages;
CREATE POLICY "anon_select_build_stages" ON build_stages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_build_stages" ON build_stages;
CREATE POLICY "anon_insert_build_stages" ON build_stages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_build_stages" ON build_stages;
CREATE POLICY "anon_update_build_stages" ON build_stages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_build_stages" ON build_stages;
CREATE POLICY "anon_delete_build_stages" ON build_stages FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_build_stages_project_sort
  ON build_stages(project_id, sort_order);


CREATE TABLE IF NOT EXISTS app_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  region_name text NOT NULL,
  region_type text NOT NULL DEFAULT 'screen',
  status text NOT NULL DEFAULT 'incomplete',
  spec jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_regions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_app_regions" ON app_regions;
CREATE POLICY "anon_select_app_regions" ON app_regions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_regions" ON app_regions;
CREATE POLICY "anon_insert_app_regions" ON app_regions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_regions" ON app_regions;
CREATE POLICY "anon_update_app_regions" ON app_regions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_app_regions" ON app_regions;
CREATE POLICY "anon_delete_app_regions" ON app_regions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_app_regions_project_sort
  ON app_regions(project_id, sort_order);
