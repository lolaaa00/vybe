-- Vybe production foundation
-- Target: Supabase PostgreSQL

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  handle TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_handle_format CHECK (
    handle IS NULL OR handle ~ '^[a-z0-9_-]{3,24}$'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_handle_unique
  ON public.profiles (LOWER(handle))
  WHERE handle IS NOT NULL;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('github', 'spotify', 'x', 'discord')),
  platform_user_id TEXT NOT NULL,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  raw_profile_json JSONB NOT NULL DEFAULT '{}',
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, platform),
  UNIQUE(platform, platform_user_id)
);

CREATE INDEX IF NOT EXISTS connected_accounts_user_idx
  ON public.connected_accounts(user_id);

DROP TRIGGER IF EXISTS connected_accounts_set_updated_at ON public.connected_accounts;
CREATE TRIGGER connected_accounts_set_updated_at
  BEFORE UPDATE ON public.connected_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.passport_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (
    section_type IN (
      'proof_of_builder',
      'proof_of_taste',
      'proof_of_presence',
      'proof_of_social',
      'proof_of_contribution'
    )
  ),
  title TEXT NOT NULL,
  summary TEXT,
  data_json JSONB NOT NULL DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'hidden')),
  source_platforms TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, section_type)
);

CREATE INDEX IF NOT EXISTS passport_sections_user_idx
  ON public.passport_sections(user_id);

CREATE INDEX IF NOT EXISTS passport_sections_visibility_idx
  ON public.passport_sections(visibility);

DROP TRIGGER IF EXISTS passport_sections_set_updated_at ON public.passport_sections;
CREATE TRIGGER passport_sections_set_updated_at
  BEFORE UPDATE ON public.passport_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.public_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  handle TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT public_passports_handle_format CHECK (handle ~ '^[a-z0-9_-]{3,24}$')
);

CREATE INDEX IF NOT EXISTS public_passports_handle_idx
  ON public.public_passports(LOWER(handle));

DROP TRIGGER IF EXISTS public_passports_set_updated_at ON public.public_passports;
CREATE TRIGGER public_passports_set_updated_at
  BEFORE UPDATE ON public.public_passports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.passport_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_platforms TEXT[] NOT NULL DEFAULT '{}',
  generated_sections JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS passport_generation_logs_user_idx
  ON public.passport_generation_logs(user_id, created_at DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_generation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_owner_select ON public.profiles;
CREATE POLICY profiles_owner_select
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_owner_insert ON public.profiles;
CREATE POLICY profiles_owner_insert
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS profiles_owner_update ON public.profiles;
CREATE POLICY profiles_owner_update
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS profiles_public_passport_read ON public.profiles;
CREATE POLICY profiles_public_passport_read
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.public_passports pp
      WHERE pp.user_id = profiles.id
        AND pp.is_public = TRUE
        AND pp.handle IS NOT NULL
    )
  );

DROP POLICY IF EXISTS connected_accounts_owner_select ON public.connected_accounts;
CREATE POLICY connected_accounts_owner_select
  ON public.connected_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS connected_accounts_owner_delete ON public.connected_accounts;
CREATE POLICY connected_accounts_owner_delete
  ON public.connected_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS passport_sections_owner_all ON public.passport_sections;
CREATE POLICY passport_sections_owner_all
  ON public.passport_sections FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS passport_sections_public_read ON public.passport_sections;
CREATE POLICY passport_sections_public_read
  ON public.passport_sections FOR SELECT
  TO anon, authenticated
  USING (
    visibility = 'public'
    AND EXISTS (
      SELECT 1 FROM public.public_passports pp
      WHERE pp.user_id = passport_sections.user_id
        AND pp.is_public = TRUE
    )
  );

DROP POLICY IF EXISTS public_passports_owner_all ON public.public_passports;
CREATE POLICY public_passports_owner_all
  ON public.public_passports FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS public_passports_public_read ON public.public_passports;
CREATE POLICY public_passports_public_read
  ON public.public_passports FOR SELECT
  TO anon, authenticated
  USING (is_public = TRUE);

DROP POLICY IF EXISTS passport_generation_logs_owner_select ON public.passport_generation_logs;
CREATE POLICY passport_generation_logs_owner_select
  ON public.passport_generation_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL ON public.connected_accounts FROM anon, authenticated;
GRANT SELECT (
  id,
  user_id,
  platform,
  platform_user_id,
  username,
  display_name,
  avatar_url,
  scopes,
  connected_at,
  updated_at
) ON public.connected_accounts TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.passport_sections TO authenticated;
GRANT SELECT ON public.passport_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_passports TO authenticated;
GRANT SELECT ON public.public_passports TO anon;
GRANT SELECT ON public.passport_generation_logs TO authenticated;
