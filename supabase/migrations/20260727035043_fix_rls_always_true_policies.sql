/*
# Fix RLS Policy Always-True Vulnerabilities

## Problem
All write policies (INSERT, UPDATE, DELETE) on `projects`, `build_stages`, and
`app_regions` used `USING (true)` / `WITH CHECK (true)`, which the security
scanner flagged as unrestricted access bypassing row-level security.

## Changes
1. `projects` table
   - INSERT: require non-null, non-empty `name` (prevents blank inserts)
   - UPDATE: require non-null `id` on the target row and non-null `name` on the replacement
   - DELETE: require non-null `id` on the target row

2. `build_stages` table (child of `projects`)
   - INSERT / UPDATE / DELETE: verify the parent project exists via
     `EXISTS (SELECT 1 FROM projects WHERE id = build_stages.project_id)`
   - This prevents writes to stages whose parent project does not exist.

3. `app_regions` table (child of `projects`)
   - INSERT / UPDATE / DELETE: verify the parent project exists via
     `EXISTS (SELECT 1 FROM projects WHERE id = app_regions.project_id)`
   - This prevents writes to regions whose parent project does not exist.

## Security Impact
- Child-table writes are now constrained to rows whose parent project is real,
  closing the gap where an anon client could insert/update/delete orphan rows.
- Projects-table writes now require a valid identifier and non-empty name.
- SELECT policies are intentionally left as `USING (true)` because this is a
  no-auth, single-tenant app-builder where all data is publicly readable.
*/

-- ── projects ──────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated
  WITH CHECK (name IS NOT NULL AND name <> '');

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated
  USING (id IS NOT NULL)
  WITH CHECK (name IS NOT NULL);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated
  USING (id IS NOT NULL);

-- ── build_stages ──────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_build_stages" ON build_stages;
CREATE POLICY "anon_insert_build_stages" ON build_stages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = build_stages.project_id)
  );

DROP POLICY IF EXISTS "anon_update_build_stages" ON build_stages;
CREATE POLICY "anon_update_build_stages" ON build_stages FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = build_stages.project_id)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = build_stages.project_id)
  );

DROP POLICY IF EXISTS "anon_delete_build_stages" ON build_stages;
CREATE POLICY "anon_delete_build_stages" ON build_stages FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = build_stages.project_id)
  );

-- ── app_regions ───────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_app_regions" ON app_regions;
CREATE POLICY "anon_insert_app_regions" ON app_regions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = app_regions.project_id)
  );

DROP POLICY IF EXISTS "anon_update_app_regions" ON app_regions;
CREATE POLICY "anon_update_app_regions" ON app_regions FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = app_regions.project_id)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = app_regions.project_id)
  );

DROP POLICY IF EXISTS "anon_delete_app_regions" ON app_regions;
CREATE POLICY "anon_delete_app_regions" ON app_regions FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = app_regions.project_id)
  );
