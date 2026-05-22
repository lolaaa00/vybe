-- Internet Passport / Vybe
-- Migration 001: Initial Schema
-- Target: Supabase PostgreSQL

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  did TEXT UNIQUE,
  wallet_address TEXT,
  privy_user_id TEXT UNIQUE,
  email TEXT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar TEXT,
  login_method TEXT CHECK (login_method IN ('google', 'apple', 'wallet')),
  passport_number TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_did ON users(did);
CREATE INDEX idx_users_wallet ON users(wallet_address);

-- CONNECTED PLATFORMS
CREATE TABLE connected_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('github', 'spotify', 'discord', 'x', 'wallet')),
  access_token_enc TEXT NOT NULL,
  refresh_token_enc TEXT,
  scopes TEXT[],
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(user_id, platform)
);

CREATE INDEX idx_connected_platforms_user ON connected_platforms(user_id);

-- ACTIVITY EVENTS
CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  type TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  value TEXT,
  metadata JSONB DEFAULT '{}',
  visibility TEXT CHECK (visibility IN ('public', 'selective', 'private')) DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_events_user ON activity_events(user_id);
CREATE INDEX idx_activity_events_platform ON activity_events(platform);
CREATE INDEX idx_activity_events_timestamp ON activity_events(timestamp DESC);

-- PASSPORT SECTIONS
CREATE TABLE passport_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  section_type TEXT CHECK (section_type IN ('taste', 'builder', 'community', 'curiosity', 'vault')),
  title TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  visibility TEXT CHECK (visibility IN ('public', 'selective', 'private')) DEFAULT 'public',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, section_type)
);

CREATE INDEX idx_passport_sections_user ON passport_sections(user_id);

-- REPUTATION SIGNALS
CREATE TABLE reputation_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL,
  awarded BOOLEAN DEFAULT FALSE,
  proof TEXT,
  evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, signal_type)
);

CREATE INDEX idx_reputation_signals_user ON reputation_signals(user_id);

-- BADGES
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  tx_hash TEXT,
  chain TEXT DEFAULT 'base-sepolia',
  token_id TEXT,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_badges_user ON badges(user_id);
CREATE INDEX idx_badges_type ON badges(badge_type);

-- SHARE LINKS
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  visibility_config JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_share_links_user ON share_links(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: users own their own data
CREATE POLICY users_select ON users FOR SELECT USING (auth.uid()::text = privy_user_id);
CREATE POLICY users_update ON users FOR UPDATE USING (auth.uid()::text = privy_user_id);

CREATE POLICY platforms_all ON connected_platforms FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text)
);

CREATE POLICY events_all ON activity_events FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text)
);

CREATE POLICY sections_all ON passport_sections FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text)
);

CREATE POLICY signals_all ON reputation_signals FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text)
);

CREATE POLICY badges_all ON badges FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text)
);

CREATE POLICY share_links_all ON share_links FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text)
);

-- Public read for passport sections marked public
CREATE POLICY sections_public_read ON passport_sections
  FOR SELECT USING (visibility = 'public');
