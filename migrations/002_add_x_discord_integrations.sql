-- Add X and Discord as first-class connected account platforms.

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.connected_accounts'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%platform%'
    AND pg_get_constraintdef(oid) LIKE '%github%'
    AND pg_get_constraintdef(oid) LIKE '%spotify%'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.connected_accounts DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

ALTER TABLE public.connected_accounts
  ADD CONSTRAINT connected_accounts_platform_check
  CHECK (platform IN ('github', 'spotify', 'x', 'discord'));
