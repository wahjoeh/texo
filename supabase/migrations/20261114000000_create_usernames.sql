create table if not exists public.usernames (
  username text primary key check (username ~ '^[a-z0-9_]{3,24}$'),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.usernames enable row level security;

-- No client policies: username mappings are only accessed by the Edge Function
-- using the server-side service role key.
